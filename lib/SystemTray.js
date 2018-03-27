'use strict';

const { app, Menu, Tray } = require('electron');
let tray = null;
let contextMenu = [];

function SystemTray(CurrentWindow, lastSessionInfo) {
    tray = new Tray(__dirname + '/../img/logo@32X32.png');

    if (process.platform === 'linux') {
        contextMenu = contextMenu.concat([{
            label: 'Open InfintyApp',
            type: 'normal',
            click: function() {
                CurrentWindow.isVisible() ? CurrentWindow.hide() : CurrentWindow.show();
            }
        }]);
    } else if (process.platform === 'win32') {
        contextMenu = contextMenu.concat([{
            label: 'Console de Desenvolvimento',
            type: 'normal',
            click: function() {
                CurrentWindow.toggleDevTools();
            }
        }, {
            type: 'separator'
        }, {
            label: 'Sair do InfintyApp',
            type: 'normal',
            click: async function() {
                console.log("[saveWindowPosition] Pegando as posicoes...");
                let position = CurrentWindow.getPosition();
                let size = CurrentWindow.getSize();

                console.log("[saveWindowPosition] Add as posicoes...");
                await lastSessionInfo.update({ "position.x": position[0], "position.y": position[1], "size.width": size[0], "size.height": size[1] })
                return app.quit();
            }
        }]);
    } else {
        return;
    }

    tray.setToolTip("InfintyApp");

    tray.on('click', () => {
        CurrentWindow.isVisible() ? CurrentWindow.hide() : CurrentWindow.show()
    });

    CurrentWindow.on('show', () => {
        tray.setHighlightMode('always')
    });

    CurrentWindow.on('hide', () => {
        tray.setHighlightMode('never')
    });

    tray.setContextMenu(Menu.buildFromTemplate(contextMenu));
}

module.exports = SystemTray;