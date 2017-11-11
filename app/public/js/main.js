'use strict';

//--------------------------------------------
//--------------VARIABLES---------------------
//--------------------------------------------

const {
    app,
    BrowserWindow,
    clipboard,
    Cookies,
    crashReporter,
    desktopCapturer,
    remote,
    shell
} = require('electron');

const request = require('request');

//--------------------------------------------
//--------------FUNCTIONS---------------------
//--------------------------------------------

function minimize() {
    var window = remote.getCurrentWindow();
    window.minimize();
}

function maximize() {
    var window = remote.getCurrentWindow();
    console.log(window.isMaximized());
    if (window.isMaximized()) {
        window.restore();
    } else {
        window.maximize();
    }
}

function close() {
    var window = remote.getCurrentWindow();
    window.isVisible() ? window.hide() : window.show()
}

function auth(arg) {
    console.log(arg)
    switch (arg) {
        case 'twitter':
            shell.openExternal('http://localhost:8000/twitter');
            console.log('OK!');
            break;
        case 'discord':
            shell.openExternal('http://localhost:8000/discord');
            console.log('OK!');
            break;
        default:
            break;
    }
}