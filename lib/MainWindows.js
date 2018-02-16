'use static';

const {
    app,
    BrowserWindow
} = require('electron');

const SystemTray = require('./SystemTray');
const scheduleUpdates = require('./autoUpdate');
const File = require('./File.js');
const isOnline = require('is-online');
const {
    EventEmitter
} = require('events');

const SI = require('./SI.js');
const {
    dev
} = require('electron-is');

var mainWindow = null;
var notificationWindow = null;

function createwindow(data, splash, Rich) {
    if (mainWindow != null) {
        return;
    }

    console.log("Criando janela...");

    var lastSessionInfo = data.lastSessionInfo ? data.lastSessionInfo : {
        size: {
            width: 1024,
            height: 720
        },
        position: {
            x: null,
            y: null
        }
    };

    var mainWindowOptions = {
        title: "InfinityApp",
        icon: __dirname + '/../img/logo.ico',
        width: lastSessionInfo.size.width,
        height: lastSessionInfo.size.height,
        x: lastSessionInfo.position.x,
        y: lastSessionInfo.position.y,
        minWidth: 800,
        minHeight: 600,
        transparent: false,
        frame: false,
        resizable: true,
        show: false
    };

    mainWindow = new BrowserWindow(mainWindowOptions);
    mainWindowOptions = null;
    lastSessionInfo = null;
    mainWindow.loadURL("http://localhost:8000/");

    if (dev) {
        console.log("Modo Developer foi ativado. Nada de Updates...");
    } else {
        console.log("Iniando o autoUpdate.");
        scheduleUpdates(EventEmitter);
    }

    SI(function (list) {
        console.log(list);
    });

    mainWindow.on('page-title-updated', function (e, title) {
        e.preventDefault();
        title = "InfinityApp";
        mainWindow.setTitle(title);
    });

    mainWindow.on('ready-to-show', function () {
        setupNotificationWindow(data)
        SystemTray(mainWindow, null);
        splash.close();
        mainWindow.show();

        isOnline().then(online => {
            console.log(`Internet is ${online}`);

            if (online) {
                //Start Rich Presence
                Rich.rpc.on('ready', () => {
                    Rich.checkPresence({
                        details: `Testing...`,
                        state: `in Menus`,
                        startTimestamp: Rich.getTime(),
                        // endTimestamp: ``,
                        largeImageKey: `infinity_logo`,
                        // smallImageKey: ``,
                        largeImageText: `InfinityApp`,
                        // smallImageText: ``,
                        instance: false,
                    });

                    console.log(`Connected to Discord! (${Rich.appClient})`);
                }).catch(console.error);

                Rich.rpc.login(Rich.appClient).catch(console.error);

                NotificationWindow.createNotifier('Conectado', 'Todas as APIs estão conectadas.', 15);
            } else {
                NotificationWindow.createNotifier('Voçê está offline', 'Recursos online estão indisponiveis.', 15);
            }
        });
    });
}

function setupNotificationWindow(db) {
    console.log("Iniciando o sistema de notificações...");
    NotificationWindow = require('./notification');
    if (NotificationWindow && db.fristNotifier) {
        NotificationWindow.fristNotifier();
        db.fristNotifier = false;
        File.SaveFile('options.json', JSON.stringify(db));
    }
}

module.exports = createwindow;