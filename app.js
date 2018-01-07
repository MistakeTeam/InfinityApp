'use static';

const {
    app,
    BrowserWindow
} = require('electron');

const isDev = require('electron-is-dev');

const fs = require('fs');
const os = require('os');
const path = require('path');
const url = require('url');
const isOnline = require('is-online');
const File = require('./lib/File.js');
const Rich = require('./lib/discord-rich-presence/rich.js');
const event = require('./lib/events.js');
const autoUpdater = require('./lib/autoUpdate.js')(sendStatusToWindow);
const Splash = require('./lib/SplashWindows');
// const steam = require('./lib/Games/Steam.js');


var eventEmitter = event.eventEmitter;
var host = require('./lib/host.js');

require('electron-reload')(__dirname);

var appVersion = app.getVersion();
var buildVersion = 'EA0212';

var notificationWindow = null;
var splash_data = null;
var mainWindow = null;
var systemTray = null;

var WIDTH = 1350;
var HEIGHT = 720;
var lastCrashed = 0;
var myName = "InfinityApp";
let FileOptions = "options.json";

function setupNotificationWindow(db) {
    console.log("Iniciando o sistema de notificações...");
    NotificationWindow = require('./lib/notification');
    if (NotificationWindow && !db.fristNotifier) {
        NotificationWindow.fristNotifier();
        db.fristNotifier = true;
        File.SaveFile(FileOptions, JSON.stringify(db));
    }
}

function setupSystemTray() {
    var SystemTray = require('./lib/SystemTray');
    if (!systemTray) {
        console.log("Iniciando o icone na bandeja do sistema...");
        systemTray = new SystemTray(mainWindow, autoUpdater.checkForUpdates(), { myName, appVersion, buildVersion });
    }
}

function setWindowVisible(isVisible, andUnminimize) {
    if (mainWindow == null) {
        return;
    }

    if (isVisible) {
        if (andUnminimize || !mainWindow.isMinimized()) {
            mainWindow.show();
        }
    } else {
        mainWindow.hide();
        if (systemTray) {
            systemTray.displayHowToCloseHint();
        }
    }

    mainWindow.setSkipTaskbar(!isVisible);
}

//==========================InfinityApp==========================
function createwindow(isVisible, options) {
    if (mainWindow) {
        mainWindow.destroy();
    }

    console.log("Criando janela...");

    if (options.themeCookie == null) {
        options.themeCookie = [];
    }

    if (options.options == null) {
        options.options = {};
    }

    if (options.options.AnimationRun == null) {
        options.options.AnimationRun = false;
    }

    if (options.fristNotifier == null) {
        options.fristNotifier = false;
    }

    if (options.lastSessionInfo == null) {
        options.lastSessionInfo = { size: { width: 1024, height: 720 }, position: { x: null, y: null } };
    }

    File.SaveFile(FileOptions, JSON.stringify(options));

    let lastSessionInfo = options.lastSessionInfo;

    var mainWindowOptions = {
        title: myName,
        icon: __dirname + '/img/logo.ico',
        width: lastSessionInfo.size.width,
        height: lastSessionInfo.size.height,
        x: lastSessionInfo.position.x,
        y: lastSessionInfo.position.y,
        minWidth: 1024,
        minHeight: 720,
        transparent: false,
        frame: false,
        resizable: true,
        show: isVisible,
        webPreferences: {
            blinkFeatures: "EnumerateDevices,AudioOutputDevices"
        }
    };

    console.log("Iniciando BrowserWindow...");
    mainWindow = new BrowserWindow(mainWindowOptions);
    mainWindow.loadURL("http://localhost:8000/");

    mainWindow.on('page-title-updated', function(e, title) {
        e.preventDefault();
        if (!title.endsWith('Infinity')) {
            title += ' - Infinity';
        }
        mainWindow.setTitle(title);
    });

    mainWindow.webContents.on('crashed', function(e, killed) {
        if (killed) {
            return app.quit();
        }
        // if we just crashed under 5 seconds ago, we are probably in a loop, so just die.
        var crashTime = Date.now();
        if (crashTime - lastCrashed < 5 * 1000) {
            return app.quit();
        }
        lastCrashed = crashTime;
        console.error('crashed... reloading');
    });

    mainWindow.on('ready-to-show', function() {
        setupSystemTray();
        splash_data.close();
        mainWindow.show();

        //Start Rich Presence
        Rich.rpc.on('ready', () => {
            console.log(`Connected to Discord! (${Rich.appClient})`);

            Rich.checkPresence({
                details: `Testing...`,
                state: `in Menus`,
                startTimestamp: Rich.getTime(),
                // endTimestamp: ``,
                largeImageKey: `infinity_logo`,
                // smallImageKey: ``,
                largeImageText: `InfinityApp`,
                // smallImageText: ``,
                instance: false,
            });
        });

        isOnline().then(online => {
            console.log(`Internet is ${online}`);

            if (online) {
                console.log(`Conectando a internet...`);
                Rich.rpc.login(Rich.appClient).catch(console.error);
            } else {
                console.log(`Você está offline.`);
            }
        });
    });
}

app.on('ready', function() {
    Splash((splash) => {
        splash_data = splash;

        File.ReadFile(FileOptions, data => {
            createwindow(false, JSON.parse(data));
        });
    });
    console.log(`Estou, Pronto!\n{platform: ${process.platform}}`);
});

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        setWindowVisible(false);
    }
});

app.on('before-quit', function(e) {
    mainWindow = null;
});

function sendStatusToWindow(to, text) {
    console.log(`${to} >> ${text}`);
    mainWindow.webContents.send(to, text);
}

module.exports = {
    app,
    File,
    createwindow,
    mainWindow
}