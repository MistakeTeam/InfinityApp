'use static';

const {
    app,
    BrowserWindow
} = require('electron');

const SystemTray = require('./SystemTray');
const { autoUpdate, autoUpdater } = require('./autoUpdate');
const isOnline = require('is-online');

var mainWindow = null;

function createwindow(data, splash, Rich) {
    if (mainWindow) {
        mainWindow.destroy();
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
    mainWindow.loadURL("http://localhost:8000/");

    console.log("Iniando o autoUpdate.");
    autoUpdate(sendStatusToWindow);

    mainWindow.on('page-title-updated', function(e, title) {
        e.preventDefault();
        title = "InfinityApp";
        mainWindow.setTitle(title);
    });

    mainWindow.on('ready-to-show', function() {
        SystemTray(mainWindow, autoUpdater.checkForUpdates());
        splash.close();
        mainWindow.show();

        //Start Rich Presence
        Rich.rpc.on('ready', () => {
            console.log(`Connected to Discord! (${Rich.appClient})`);

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
        });

        isOnline().then(online => {
            console.log(`Internet is ${online}`);

            if (online) {
                console.log(`Conectando a internet...`);
                Rich.rpc.login(Rich.appClient).catch(console.error);
            } else {
                console.log(`Você está offline.`);
            }
        });
    });
}

function sendStatusToWindow(to, text) {
    console.log(`${to} >> ${text}`);
    mainWindow.webContents.send(to, text);
}

module.exports = createwindow;