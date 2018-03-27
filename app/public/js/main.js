'use strict';

global.$ = $;
global.bluebird = require("bluebird");

const path = require('path'),
    child = require('child_process'),
    { app, autoUpdater, remote, shell } = require('electron'),
    markdown = require("markdown").markdown,
    isOnline = require('is-online'),
    fs = require('fs'),
    { dev } = require('electron-is'),
    chalk = require('chalk'),
    progress_stream = require('progress-stream');

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
    gamesData;

try {
    DB = require(path.resolve(process.cwd(), './lib/Database/database_ops.js'));
} catch (err) {
    DB = require(path.resolve(process.cwd(), './resources/app.asar/lib/Database/database_ops.js'));
}

try {
    File = require(path.resolve(process.cwd(), './lib/File.js'));
} catch (err) {
    File = require(path.resolve(process.cwd(), './resources/app.asar/lib/File.js'));
}

try {
    eventEmitter = require(path.resolve(process.cwd(), './lib/events.js')).eventEmitter;
} catch (err) {
    eventEmitter = require(path.resolve(process.cwd(), './resources/app.asar/lib/events.js')).eventEmitter;
}

try {
    IAPI = require(path.resolve(process.cwd(), './lib/InfinityAPI/api.js'));
} catch (err) {
    IAPI = require(path.resolve(process.cwd(), './resources/app.asar/lib/InfinityAPI/api.js'));
}

try {
    notifier = require(path.resolve(process.cwd(), './lib/notifier.js'));
} catch (err) {
    notifier = require(path.resolve(process.cwd(), './resources/app.asar/lib/notifier.js'));
}

try {
    Rich = require(path.resolve(process.cwd(), './lib/discord-rich-presence/rich.js'));
} catch (err) {
    Rich = require(path.resolve(process.cwd(), './resources/app.asar/lib/discord-rich-presence/rich.js'));
}

try {
    iconExtractor = require(path.resolve(process.cwd(), './lib/Icon-Extractor/win-iconExtractor.js'));
} catch (err) {
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

function touchCloseMenus() {
    if ($('#touchCloseMenus').length == 0) {
        $('.downmost').append(`<div id="touchCloseMenus" style="z-index: 15"></div>`);
    }
    $('#touchCloseMenus').click((events) => {
        if ($('.play_easy').length > 0) {
            $('.play_easy').remove();
        }

        if ($('#right-mouse-options').length > 0) {
            $('#right-mouse-options').remove();
        }

        if ($('.central-notifications').length > 0) {
            $('.central-notifications').remove();
        }

        $('#touchCloseMenus').remove();
    })
}

//===================Process handler===================//
process.on('unhandledRejection', function(err, p) {
    console.log(chalk.green("//===================Error===================//"));
    console.log(chalk.red('Unhandled Rejection at: Promise \n', JSON.stringify(p), "\n\nReason:", err.stack));
    console.log(chalk.green("//===================Error===================//"));
});

process.on('uncaughtException', function(err) {
    console.log(chalk.green("//===================Error===================//"));
    console.log(chalk.red(err.stack));
    console.log(chalk.green("//===================Error===================//"));
});
//===================Process handler===================//

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
    // SystemTray(CurrentWindow, checkForUpdates, optionData);

    setTimeout(async() => {
        if (dev) {
            console.log("[update] Modo Developer foi ativado. Nada de Updates...");
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

        //Load finish
        $('.blur').css('z-index', '0');
        $('.loading-init').remove();
    }, 2500);
}

mainApp();