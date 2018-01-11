'use static';

const { BrowserWindow } = require('electron');
const File = require('./File.js');
const url = require('url');
const path = require('path');

var splash = null;

function SplashWindows(cb) {
    if (splash != null) {
        return;
    }

    splash = new BrowserWindow({ width: 300, height: 125, frame: false, resizable: false, transparent: true, icon: __dirname + "/../img/logo.ico" });
    splash.loadURL(url.format({
        pathname: path.join(__dirname, '../splash/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    splash.on('page-title-updated', function(e, title) {
        e.preventDefault();
        title = "InfinityApp";
        splash.setTitle(title);
    });

    splash.webContents.on('did-finish-load', () => {
        splash.show();
    });

    splash.on('closed', () => splash = null);

    cb(splash);
}

module.exports = SplashWindows;