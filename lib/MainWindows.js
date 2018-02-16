'use static';

const {
    app,
    BrowserWindow
} = require('electron');

const SystemTray = require('./SystemTray');
const scheduleUpdates = require('./autoUpdate');
const File = require('./File.js');
const isOnline = require('is-online');
const event = require('./events');

const SI = require('./SI.js');
const { dev } = require('electron-is');

var mainWindow = null;
var notificationWindow = null;

function createwindow(data) {
    if (mainWindow != null) {
        return;
    }

    console.log("Criando janela...");

    var lastSessionInfo = data.lastSessionInfo ? data.lastSessionInfo : { size: { width: 1024, height: 720 }, position: { x: null, y: null } };

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
        scheduleUpdates(event.eventEmitter);
    }

    SI(function(list) {
        console.log(list);
    });

    mainWindow.on('page-title-updated', function(e, title) {
        e.preventDefault();
        title = "InfinityApp";
        mainWindow.setTitle(title);
    });

    mainWindow.on('maximize', function(e) {
        data.isMaximize = true;
        File.SaveFile('options.json', JSON.stringify(data));
    });

    mainWindow.on('unmaximize', function(e) {
        data.isMaximize = false;
        File.SaveFile('options.json', JSON.stringify(data));
    });

    mainWindow.on('ready-to-show', function() {
        setupNotificationWindow(data)
        SystemTray(mainWindow, null);
        event.eventEmitter.emit('splashClose');
        mainWindow.show();
        if (data.isMaximize) {
            mainWindow.maximize();
        }

        isOnline().then(online => {
            console.log(`Internet is ${online}`);

            if (online) {
                event.eventEmitter.emit('startRich');

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