'use strict';

const { production, dev } = require('electron-is'), { app } = require('electron'),
    createMainWindow = require('./main/createWindow'), { port } = require('./main/createHost');
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

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});