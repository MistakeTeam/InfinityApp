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

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

/* Handling squirrel.windows events on windows 
only required if you have build the windows with target squirrel. For NSIS target you don't need it. */
if (require('electron-squirrel-startup')) {
    app.quit();
}

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
    splash = new BrowserWindow({ width: 600, height: 300, frame: false, transparent: true, icon: __dirname + "/img/logo.png" });
    splash.loadURL(url.format({
        pathname: path.join(__dirname, '/splash/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    splash.on('page-title-updated', function(e, title) {
        e.preventDefault();
        title = 'Slash';
        splash.setTitle(title);
    });

    splash.on('closed', () => splash = null);
    splash.webContents.on('did-finish-load', () => {
        splash.show();
    });
}

function setupNotificationWindow() {
    var NotificationWindow = require('./notification');
    if (!NotificationWindow) {
        NotificationWindow.createWindow();
    }
}

function setupSystemTray() {
    var SystemTray = require('./SystemTray');
    if (!systemTray) {
        systemTray = new SystemTray(mainWindow, /*appUpdater()*/ null, { myName, appVersion, buildVersion });
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

    if (options != null) {
        if (options.saveGames == null) { // Move old savegames
            options.saveGames = null;
        }
        if (options.developerMode) {
            app.developerMode = true;
            options.developerMode = false;
        }

        File.SaveFile(FileOptions, JSON.stringify(options));
    }

    let lastSessionInfo = options != null && options.lastSessionInfo != null ?
        options.lastSessionInfo : { size: { width: 1350, height: 720 }, position: { x: null, y: null } };

    // if (lastSessionInfo.size.width == 0 || lastSessionInfo.size.height == 0 || lastSessionInfo.position.x == 0 || lastSessionInfo.position.y == 0) {
    //     lastSessionInfo = { size: { width: 1350, height: 720 }, position: { x: null, y: null } };
    // }

    var mainWindowOptions = {
        title: myName,
        icon: __dirname + '/img/logo.png',
        backgroundColor: ACCOUNT_GREY,
        width: lastSessionInfo.size.width,
        height: lastSessionInfo.size.height,
        x: lastSessionInfo.position.x,
        y: lastSessionInfo.position.y,
        minWidth: 800,
        minHeight: 600,
        transparent: false,
        frame: false,
        resizable: true,
        show: isVisible,
        webPreferences: {
            blinkFeatures: "EnumerateDevices,AudioOutputDevices"
        }
    };

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
            //appUpdater();
        }
    });

    mainWindow.on('focus', function() {
        mainWindow.focus();
    });

    setupSystemTray();
}

app.on('ready', function() {
    createslash();
    File.ReadFile(FileOptions, data => {
        createwindow(false, JSON.parse(data));
    });
    if (process.platform === 'win32') {
        setupNotificationWindow();
    }
    console.log("Estou, Pronto!");

    // Fechando splash e abrindo app
    setTimeout(function() {
        splash.close();
        mainWindow.show();
    }, 10000);
});

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
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
    remote: remote
}

//---------------TESTES---------------



//---------------FUNCTIONS---------------

function isWindowsOrmacOS() {
    return process.platform === 'darwin' || process.platform === 'win32';
}

function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};