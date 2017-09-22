'use strict';

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
var fs = require('fs');
var path = require('path');
var AutoRun = require('./AutoRun');
var File = require('./File.js');

var tray = null;

var contextMenu = [];

function SystemTray(mainWindow, onUpdate, options) {
    tray = new Tray(__dirname + '/img/tray.png');

    if (process.platform === 'linux') {
        contextMenu = contextMenu.concat([{
            label: 'Open ' + options.myName,
            type: 'normal',
            click: function() { mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show(); }
        }]);
    }

    var autoRunIndex = contextMenu.length;
    contextMenu = contextMenu.concat([{
        label: 'Iniciar ' + options.myName + ' na inicialização do computador',
        type: 'checkbox',
        checked: false,
        enabled: false,
        click: null
    }, {
        label: 'Verificar Atualizações',
        type: 'normal',
        click: onUpdate
    }, {
        type: 'separator'
    }, {
        label: 'Console de Desenvolvimento',
        type: 'normal',
        click: function() {
            mainWindow.toggleDevTools();
        }
    }, {
        type: 'separator'
    }, {
        label: 'Sair do ' + options.myName,
        type: 'normal',
        click: function() { File.saveWindowPosition(mainWindow, () => { app.quit(); }) }
    }]);

    tray.setToolTip(`${options.myName} ${options.appVersion}.${options.buildVersion}`);

    //tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    });

    mainWindow.on('show', () => {
        tray.setHighlightMode('always')
    });

    mainWindow.on('hide', () => {
        tray.setHighlightMode('never')
    });

    AutoRun.isAutoRunning(function(isAutoRunning) {
        contextMenu[autoRunIndex].checked = isAutoRunning;
        contextMenu[autoRunIndex].enabled = true;
        tray.setContextMenu(Menu.buildFromTemplate(contextMenu));
    });

    tray.setContextMenu(Menu.buildFromTemplate(contextMenu));
}

module.exports = SystemTray;