'use static';

const {
    app,
    autoUpdater,
    BrowserWindow,
    Menu,
    remote
} = require('electron');

const isDev = require('electron-is-dev'); // this is required to check if the app is running in development mode. 
autoUpdater.setFeedURL("https://github.com/xDeltaFox/InfinityApp/releases/latest/");

const fs = require('fs');
const os = require('os');
const path = require('path');
const url = require('url');
const File = require('./File.js');
// const Rich = require('./lib/discord-rich-presence/rich.js');
const event = require('./events.js');
// const steam = require('./lib/Games/Steam.js');
const log = require("fancy-log");

var eventEmitter = event.eventEmitter;
//HOST
var host = require('./host.js');

require('electron-reload')(__dirname);

var appVersion = app.getVersion();
var buildVersion = 'EA0212';
var start = new Date().getTime() / 1000;

var notificationWindow = null;
var mainWindow = null;
var splash = null;
var login = null;
var systemTray = null;

var WIDTH = 1350;
var HEIGHT = 720;
var ACCOUNT_GREY = '#DBC392';
var lastCrashed = 0;
var myName = "InfinityApp";
let IsCloudEnabled = false;
let FileOptions = "options.json";

function capitalizeFirstLetter(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function webContentsSend() {
    if (mainWindow != null && mainWindow.webContents != null) {
        var _mainWindow$webConten;
        (_mainWindow$webConten = mainWindow.webContents).send.apply(_mainWindow$webConten, arguments);
    }
}

//==========================Splash==========================
function createslash() {
    if (splash != null) {
        return;
    }

    splash = new BrowserWindow({ width: 300, height: 111, frame: false, transparent: true, icon: __dirname + "/img/logo.png" });
    splash.loadURL(url.format({
        pathname: path.join(__dirname, '/splash/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    splash.on('page-title-updated', function(e, title) {
        e.preventDefault();
        if (title == '') title = 'Infinity';
        else title += ' - Infinity';
        splash.setTitle(title);
    });

    splash.on('closed', () => splash = null);
    splash.webContents.on('did-finish-load', () => {
        splash.show();
    });

    File.ReadFile(FileOptions, data => {
        createwindow(false, JSON.parse(data));
    });
}

function setupNotificationWindow(db) {
    log.info("Iniciando o sistema de notificações...");
    NotificationWindow = require('./notification');
    if (NotificationWindow && !db.fristNotifier) {
        NotificationWindow.fristNotifier();
        db.fristNotifier = true;
        File.SaveFile(FileOptions, JSON.stringify(db));
    }
}

function setupSystemTray() {
    log.info("Iniciando o icone na bandeja do sistema...");
    var SystemTray = require('./SystemTray');
    if (!systemTray) {
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
            webContentsSend('MAIN_WINDOW_FOCUS');
        }
    } else {
        webContentsSend('MAIN_WINDOW_BLUR');
        mainWindow.hide();
        if (systemTray) {
            systemTray.displayHowToCloseHint();
        }
    }

    mainWindow.setSkipTaskbar(!isVisible);
}

//==========================InfinityApp==========================
function createwindow(isVisible, options) {
    // want to be able to re-run this and set things up again
    if (mainWindow) {
        // message here?
        mainWindow.destroy();
    }

    log.info("Criando janela...");

    if (options.themeCookie == null) {
        options.themeCookie = {};
    }

    if (options.savedGames == null) {
        options.savedGames = {};
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

    log.info("Iniciando BrowserWindow...");
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

    mainWindow.webContents.once('did-frame-finish-load', () => {
        const checkOS = isWindowsOrmacOS();
        if (checkOS && !isDev) {
            autoUpdater.checkForUpdates();
        }
    });

    mainWindow.on('ready-to-show', function() {
        setupSystemTray();
        // setupNotificationWindow(options);
        splash.close();
        mainWindow.show();

        //Start Rich Presence
        // Rich.rpc.on('ready', () => {
        //     log(`Connected to Discord! (${Rich.appClient})`);

        //     Rich.checkPresence({
        //         details: `Testing...`,
        //         state: `in Menus`,
        //         startTimestamp: start > start + 3600 ? start = new Date().getTime() / 1000 : start,
        //         // endTimestamp: ``,
        //         largeImageKey: `infinity_logo`,
        //         // smallImageKey: ``,
        //         largeImageText: `InfinityApp`,
        //         // smallImageText: ``,
        //         instance: false,
        //     });
        // });
        // Rich.rpc.login(Rich.appClient).catch(log.error);
    });
}

function sendStatusToWindow(to, text) {
    log.info(`${to} >> ${text}`);
    mainWindow.webContents.send(to, text);
}

app.on('ready', function() {
    createslash();
    log.info(`Estou, Pronto!\n{platform: ${process.platform}}`);
});

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        setWindowVisible(false);
    }
});

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('before-quit', function(e) {
    mainWindow = null;
    if (notificationWindow != null) {
        notificationWindow.close();
    }
});

//----------------------------------------
//--------------autoUpdater---------------
//----------------------------------------

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('updatetext', 'Buscando atualizações...');
});

autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('updatetext', 'Atualização disponivel');
});

autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('updatetext', 'Está é a ultima versão.');
});

autoUpdater.on('error', (err) => {
    sendStatusToWindow('updatetext', 'Erro ao atualizar.');
});

autoUpdater.on('download-progress', (progressObj) => {
    let speed = ((progressObj.bytesPerSecond / 1000) / 1000).toFixed(1);
    let transferred = ((progressObj.transferred / 1000) / 1000).toFixed(1);
    let total = ((progressObj.total / 1000) / 1000).toFixed(1);
    let percent = progressObj.percent.toFixed(1);

    let log_message = "Velocidade: " + speed + " Mb/s";
    log_message = log_message + ' - Baixado: ' + percent + '%';
    log_message = log_message + ' (' + transferred + "/" + total + ')';
    sendStatusToWindow('updatetext', log_message);
});

autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('updatetext', 'Atualização baixada, em 5 segundos será instalada.');

    setTimeout(function() {
        autoUpdater.quitAndInstall();
    }, 5000)
});

module.exports = {
    app,
    remote,
    File,
    createwindow,
    mainWindow,
    splash,
    login
}

//---------------------------------------
//---------------FUNCTIONS---------------
//---------------------------------------

function isWindowsOrmacOS() {
    return process.platform === 'darwin' || process.platform === 'win32';
}