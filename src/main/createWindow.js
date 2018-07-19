'use strict';

const { BrowserWindow } = require('electron');

/**
 * 
 * @param {String} src 
 * @param {Boolean} isDev 
 */
module.exports = async(src, isDev) => {
    let lastSessionInfo = {
            size: {
                width: 1000,
                height: 600
            },
            position: {
                x: 0,
                y: 0
            },
            isMaximize: false
        },
        mainWindowOptions = {
            title: "InfinityApp",
            // icon: __dirname + './img/logo@32X32.png',
            width: lastSessionInfo.size.width,
            height: lastSessionInfo.size.height,
            x: lastSessionInfo.position.x,
            y: lastSessionInfo.position.y,
            minWidth: 1000,
            minHeight: 600,
            backgroundColor: '#000000',
            transparent: false,
            frame: false,
            resizable: true,
            show: true,
            webPreferences: {
                devTools: false
            }
        }

    if (isDev) {
        mainWindowOptions.webPreferences.devTools = true;
    }

    const mainWindow = new BrowserWindow(mainWindowOptions);
    mainWindowOptions = null;

    await mainWindow.loadURL(src);

    return mainWindow;
}