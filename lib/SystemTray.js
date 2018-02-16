'use strict';

const {
    app,
    Menu,
    Tray
} = require('electron');
const fs = require('fs');
const path = require('path');
const File = require('./File.js');

var tray = null;

var contextMenu = [];

function SystemTray(mainWindow, onUpdate) {
    tray = new Tray(__dirname + '/../img/tray.png');

    if (process.platform === 'linux') {
        contextMenu = contextMenu.concat([{
            label: 'Open InfintyApp',
            type: 'normal',
            click: function () {
                mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
            }
        }]);
    } else if (process.platform === 'win32') {
        contextMenu = contextMenu.concat([{
            label: 'Verificar Atualizações',
            type: 'normal',
            click: onUpdate
        }, {
            type: 'separator'
        }, {
            label: 'Console de Desenvolvimento',
            type: 'normal',
            click: function () {
                mainWindow.toggleDevTools();
            }
        }, {
            type: 'separator'
        }, {
            label: 'Sair do InfintyApp',
            type: 'normal',
            click: function () {
                File.saveWindowPosition(mainWindow, () => {
                    return app.quit();
                })
            }
        }]);
    } else {
        return;
    }

    tray.setToolTip("InfintyApp");

    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    });

    mainWindow.on('show', () => {
        tray.setHighlightMode('always')
    });

    mainWindow.on('hide', () => {
        tray.setHighlightMode('never')
    });

    tray.setContextMenu(Menu.buildFromTemplate(contextMenu));
}

module.exports = SystemTray;