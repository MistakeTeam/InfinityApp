'use strict';

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

var eventEmitter;

try {
    eventEmitter = require(path.resolve(process.cwd(), './events.js')).eventEmitter;
} catch (err) {
    eventEmitter = require(path.resolve(process.cwd(), './resources/app/events.js')).eventEmitter;
}

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

function format(seconds) {
    function pad(s) {
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor(seconds % (60 * 60) / 60);
    var seconds = Math.floor(seconds % 60);

    if (hours > 0) {
        return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
    } else {
        return pad(minutes) + ':' + pad(seconds);
    }
}

// event global

// eventEmitter.on('onloading', function() {
//     $('.downmost').append(`

//     `);
// })