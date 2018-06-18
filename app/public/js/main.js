'use strict';

// check Bowser
var userAgent = navigator.userAgent.toLowerCase();
console.log(userAgent);
if (!userAgent.includes('electron')) {
    document.getElementsByClassName('app-mount')[0].style.display = 'none';
}

global.$ = $;
global.bluebird = require("bluebird");

const path = require('path'),
    child = require('child_process'),
    { app, autoUpdater, remote, shell } = require('electron'),
    { dialog } = remote,
    markdown = require("markdown").markdown,
    isOnline = require('is-online'),
    fs = require('fs'),
    { dev } = require('electron-is'),
    chalk = require('chalk'),
    progress_stream = require('progress-stream'),
    moment = require('moment');

let iconExtractor,
    File,
    eventEmitter,
    IAPI,
    notifier,
    Rich,
    DB,
    connection,
    CurrentWindow = remote.getCurrentWindow(),
    optionData,
    gamesData,
    CLOSE_MENU = false,
    path_asar = '';

if (!dev()) {
    path_asar = `/resources/app.asar`;
}

DB = require(path.resolve(process.cwd(), `.${path_asar}/lib/Database/database_ops.js`));
File = require(path.resolve(process.cwd(), `.${path_asar}/lib/File.js`));
eventEmitter = require(path.resolve(process.cwd(), `.${path_asar}/lib/events.js`)).eventEmitter;
IAPI = require(path.resolve(process.cwd(), `.${path_asar}/lib/InfinityAPI/api.js`));
notifier = require(path.resolve(process.cwd(), `.${path_asar}/lib/notifier.js`));
Rich = require(path.resolve(process.cwd(), `.${path_asar}/lib/discord-rich-presence/rich.js`));

if (dev()) {
    iconExtractor = require(path.resolve(process.cwd(), './lib/Icon-Extractor/win-iconExtractor.js'));
} else {
    iconExtractor = require(path.resolve(process.cwd(), './resources/lib/Icon-Extractor/win-iconExtractor.js'));
}

function getData(type) {
    return new bluebird(async resolve => {
        switch (type) {
            case 'option':
                DB.optionsDB.findOne({ id: 'global' }).then(data => {
                    if (!data) return resolve(DB.optionsDB.new());
                    return resolve(data);
                });
                break;
            case 'games':
                DB.gamesDB.findOne({ id: 'global' }).then(data => {
                    if (!data) return resolve(DB.gamesDB.new());
                    return resolve(data);
                });
                break;
            default:
                break;
        }
    });
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
        return console.log(`[main] Não é um URL valído.`);
    }
}

function replaceFormat(s) {
    if (typeof s !== String) return;
    s
        .replace('.mp3', '')
        .replace('.mp4', '')
        .replace('.avi', '')
        .replace('.mkv', '')
        .replace('.wmv', '')
        .replace('.wma', '')
        .replace('.mov', '')
        .replace('.3pg', '')
        .replace('.ogg', '')
        .replace('.flv', '')
        .replace('.vob', '');
    return s;
}

function bytesToSize(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function validFileType(file, types) {
    for (var i = 0; i < types.length; i++) {
        if (file.type === types[i]) {
            return true;
        }
    }

    return false;
}

function isMultiplicador(a, b) {
    for (let i = 1; i < 10; i++) {
        let r = a / i;
        if (r == b) {
            return true;
        }
    }
    return false;
}

/*
var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed

var req = request('http://somefeedurl.xml')
var feedparser = new FeedParser([options]);

req.on('error', function (error) {
  // handle any request errors
});

req.on('response', function (res) {
  var stream = this; // `this` is `req`, which is a stream

  if (res.statusCode !== 200) {
    this.emit('error', new Error('Bad status code'));
  }
  else {
    stream.pipe(feedparser);
  }
});

feedparser.on('error', function (error) {
  // always handle errors
});

feedparser.on('readable', function () {
  // This is where the action is!
  var stream = this; // `this` is `feedparser`, which is a stream
  var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
  var item;

  while (item = stream.read()) {
    console.log(item);
  }
});
*/

async function scheduleUpdates() {
    autoUpdater.setFeedURL(`https://github.com/MistakeTeam/InfinityApp/releases`);

    eventEmitter.on('checking-for-update', (title, description) => {
        notifier(title, {
            message: description
        });
    });

    eventEmitter.on('update-available', (title, description) => {
        notifier(title, {
            message: description
        });
    });

    eventEmitter.on('update-not-available', (title, description) => {
        notifier(title, {
            message: description
        });
    });

    eventEmitter.on('error', (title, description) => {
        notifier(title, {
            message: description
        });
    });

    eventEmitter.on('download-progress', (title, description) => {
        console.log(description);
    });

    eventEmitter.on('update-downloaded', (title, description) => {
        notifier(title, {
            message: description
        });
    });

    autoUpdater.on('checking-for-update', () => {
        eventEmitter.emit('checking-for-update', 'Atualização', 'Buscando atualizações...');
    });

    autoUpdater.on('update-available', (info) => {
        eventEmitter.emit('update-available', 'Atualização', 'Atualização disponivel');
    });

    autoUpdater.on('update-not-available', (info) => {
        eventEmitter.emit('update-not-available', 'Atualização', 'Está é a ultima versão.');
    });

    autoUpdater.on('error', err => {
        eventEmitter.emit('error', 'Atualização', 'Erro ao atualizar.');
    });

    autoUpdater.on('download-progress', (progressObj) => {
        let speed = ((progressObj.bytesPerSecond / 1000) / 1000).toFixed(1);
        let transferred = ((progressObj.transferred / 1000) / 1000).toFixed(1);
        let total = ((progressObj.total / 1000) / 1000).toFixed(1);
        let percent = progressObj.percent.toFixed(1);

        let log_message = `Velocidade: ${speed} Mb/s - Baixado: ${percent}% (${transferred}/${total})`;

        eventEmitter.emit('download-progress', 'Atualização', log_message);
    });

    autoUpdater.on('update-downloaded', (info) => {
        eventEmitter.emit('update-downloaded', 'Atualização', 'Atualização baixada, em 5 segundos será instalada.');

        setTimeout(function() {
            autoUpdater.quitAndInstall();
        }, 5000);
    });

    // Check for updates at startup and once an hour
    setTimeout(() => {
        checkForUpdates();
        setInterval(() => {
            checkForUpdates();
        }, 60 * 60 * 1000);
    }, 10 * 1000);
}

async function checkForUpdates() {
    if (!connection) {
        return;
    }

    console.log('[checkForUpdates] Check for update');
    autoUpdater.checkForUpdates();
}

async function startRich() {
    setTimeout(() => {
        if (optionData.options.rich) {
            Rich.activate();
        } else {
            Rich.deactivate();
        }
    }, 10);
}

async function refreshDB() {
    optionData = await getData('option');
    gamesData = await getData('games');
}

async function mainApp() {
    await refreshDB();

    console.log(optionData, gamesData);

    moment.locale(optionData.options.lang);

    if (optionData.fristOpenApp == true) {
        console.log(`[fristOpenApp] Iniciando pela primeira vez.`);
        let folder_path = `${process.env.APPDATA}/InfinityApp`;

        if (!fs.existsSync(folder_path + '/games')) {
            fs.mkdirSync(folder_path + '/games');
            fs.chmodSync(folder_path + '/games', '777');
            if (!fs.existsSync(folder_path + '/games/Icons')) {
                fs.mkdirSync(folder_path + '/games/Icons');
                fs.chmodSync(folder_path + '/games/Icons', '777');
            }
        }

        if (!fs.existsSync(folder_path + '/themes')) {
            fs.mkdirSync(folder_path + '/themes');
            fs.chmodSync(folder_path + '/themes', '777');
        }

        if (!fs.existsSync(folder_path + '/wallpaper')) {
            fs.mkdirSync(folder_path + '/wallpaper');
            fs.chmodSync(folder_path + '/wallpaper', '777');
        }

        await optionData.update({ "fristOpenApp": false });
        console.log(`[fristOpenApp] Goodbye...`);
        return app.quit();
    }

    themeUpdate();
    themewallpaper();
    checkTheme();
    reloadLang();
    eventEmitter.emit('onStartupApp');

    if (dev()) {
        console.log("[update] Modo Developer foi ativado. Nada de Updates...");
        scheduleUpdates();
    } else {
        console.log("[update] Iniando o autoUpdate.");
        scheduleUpdates();
    }

    if (notifier && optionData.fristNotifier) {
        notifier('Bem-vindo', {
            message: 'Olá esse é um muilt-tarefas, ainda sem utilidades.'
        });
        await optionData.update({ 'fristNotifier': false });
    }

    IAPI.init({
        state: 'Menu',
        active: false
    });

    isOnline().then(online => {
        connection = online;
        if (online) {
            startRich();

            notifier('Conectado', {
                message: 'Todas as APIs estão conectadas.'
            });
        } else {
            notifier('Voçê está offline', {
                message: 'Recursos online estão indisponiveis.'
            });
        }
    });

    // setInterval(async () => {

    // }, 500);

    //Load finish
    $('.blur').css('z-index', '-1');
    $('.loading-init').remove();
}

mainApp();