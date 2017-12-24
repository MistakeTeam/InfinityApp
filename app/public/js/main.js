'use strict';

const {
    app,
    BrowserWindow,
    clipboard,
    Cookies,
    crashReporter,
    desktopCapturer,
    ipcRenderer,
    remote,
    shell
} = require('electron');

var eventEmitter;

try {
    eventEmitter = require(path.resolve(process.cwd(), './events.js')).eventEmitter;
} catch (err) {
    eventEmitter = require(path.resolve(process.cwd(), './resources/app/events.js')).eventEmitter;
}

ipcRenderer.on('updatetext', (event, message) => {
    console.log(`sla: ${message}`);
    $('.update-box').children('span').text(message);
})

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

function URLExternal(url) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        shell.openExternal(url);
    } else {
        return console.log(`Não é um URL valído.`);
    }
}

$(document).on('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
});

$(document).on('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
});

$('.itens-button').on('dragenter', function(e) {
    switch ($(this).attr('data-internal-name')) {
        case 'util-game':
            $(this).children('.drag-event').css('display', 'block');
            setTimeout(() => {
                $(this).children('.drag-event').children('.uploadbox').css('background', 'rgba(0, 0, 0, 0.75)');
            }, 10);
            break;
        default:
            break;
    }
});

$('.itens-button').on('dragleave', function(e) {
    switch ($(this).attr('data-internal-name')) {
        case 'util-game':
            $(this).children('.drag-event').css('display', 'none');
            $(this).children('.drag-event').children('.uploadbox').css('background', 'transparent');
            break;
        default:
            break;
    }
});

// event global

// eventEmitter.on('onloading', function() {
//     $('.downmost').append(`

//     `);
// })