'use static';

const {
    app,
    autoUpdater,
    BrowserView,
    BrowserWindow,
    BrowserWindowProxy,
    ClientRequest,
    clipboard,
    contentTracing,
    Cookies,
    crashReporter,
    Debugger,
    desktopCapturer,
    dialog,
    DownloadItem,
    globalShortcut,
    IncomingMessage,
    ipcMain,
    ipcRenderer,
    Menu,
    MenuItem,
    nativeImage,
    net,
    powerSaveBlocker,
    protocol,
    remote,
    session,
    shell,
    systemPreferences,
    TouchBar,
    Tray,
    webContents,
    webFrame,
    WebRequest,
    webviewTag
} = require('electron');

const isDev = require('electron-is-dev'); // this is required to check if the app is running in development mode. 
const { appUpdater } = require('./appUpdate.js');

const fs = require('fs');
const os = require('os');
const path = require('path');
const url = require('url');
const File = require('./File.js');

//HOST
var host = require('./host.js');

require('electron-reload')(__dirname);

var appVersion = app.getVersion();
var buildVersion = 'EA0212';
app.getLocale();

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
    console.log("Iniciando o sistema de notificações...");
    var NotificationWindow = require('./notification');
    if (NotificationWindow && !db.fristNotifier) {
        NotificationWindow.fristNotifier();
        db.fristNotifier = true;
        File.SaveFile(FileOptions, JSON.stringify(db));
    }
}

function setupSystemTray() {
    console.log("Iniciando o icone na bandeja do sistema...");
    var SystemTray = require('./SystemTray');
    if (!systemTray) {
        systemTray = new SystemTray(mainWindow, appUpdater(), { myName, appVersion, buildVersion });
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

    console.log("Criando janela...");

    if (options != null) {
        if (options.saveGames == null) { // Move old savegames
            options.saveGames = {};
        }
        if (options.developerMode) {
            app.developerMode = true;
            options.developerMode = false;
        }

        if (options.fristNotifier == null) {
            options.fristNotifier = false
        }

        File.SaveFile(FileOptions, JSON.stringify(options));
    }

    let lastSessionInfo = options != null && options.lastSessionInfo != null ?
        options.lastSessionInfo : { size: { width: 1024, height: 720 }, position: { x: null, y: null } };

    // if (lastSessionInfo.size.width == 0 || lastSessionInfo.size.height == 0 || lastSessionInfo.position.x == 0 || lastSessionInfo.position.y == 0) {
    //     lastSessionInfo = { size: { width: 1350, height: 720 }, position: { x: null, y: null } };
    // }

    var mainWindowOptions = {
        title: myName,
        icon: __dirname + '/img/logo-infinity2.ico',
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

    mainWindow.webContents.once('did-frame-finish-load', () => {
        const checkOS = isWindowsOrmacOS();
        if (checkOS && !isDev) {
            // Initate auto-updates on macOs and windows
            appUpdater();
        }
    });

    mainWindow.on('ready-to-show', function() {
        setupSystemTray();
        setupNotificationWindow(options);
        splash.close();
        mainWindow.show();
    });
}

app.on('ready', function() {
    createslash();
    console.log(`Estou, Pronto!\n{platform: ${process.platform}}`);
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

app.on('open-url', function(event, openURL) {
    var parsedURL = _url2.default.parse(openURL);
    console.log(parsedURL)
});

app.on('before-quit', function(e) {
    mainWindow = null;
    if (notificationWindow != null) {
        notificationWindow.close();
    }
});

module.exports = {
    app: app,
    remote: remote,
    File: File,
    createwindow: createwindow,
    mainWindow: mainWindow,
    splash: splash,
    login: login
}

//---------------TESTES---------------



//---------------FUNCTIONS---------------

function isWindowsOrmacOS() {
    return process.platform === 'darwin' || process.platform === 'win32';
}