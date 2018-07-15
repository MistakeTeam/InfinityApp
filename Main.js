'use strict';

const { production, dev } = require('electron-is'), { app } = require('electron'),
    createMainWindow = require('./src/main/createWindow.js'), { port } = require('./src/main/createHost.js');
require('electron-reload')(__dirname);

let mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', async function() {
    if (mainWindow != null) return;

    mainWindow = await createMainWindow(`http://localhost:${port}/`, dev());

    mainWindow.on('focus', () => {
        mainWindow.webContents.send('windows-focus-effects');
    });

    mainWindow.on('blur', () => {
        mainWindow.webContents.send('windows-blur-effects');
    });

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});