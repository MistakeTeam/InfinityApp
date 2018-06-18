'use static';
process.title = 'InfinityApp';

let { production, dev } = require('electron-is');
const path = require("path");
const fs = require('fs');

//open mongod
var mongod = require('child_process').execFile(`C:\\Program Files\\MongoDB\\Server\\3.6\\bin\\mongod.exe`);
// fs.exists(`C:\\Program Files\\MongoDB\\Server\\3.6\\bin\\mongod.exe`, (e) => {
//     if (e) {
//         mongod = require('child_process').execFile(`C:\\Program Files\\MongoDB\\Server\\3.6\\bin\\mongod.exe`);
//     } else {
//         throw new Error(`Não foi possivel encontrar em sua maquina o MongoDB. Por favor instale-o antes de abrir o InfinityApp novamente.`);
//     }
// });

const env = require('./env.js');
const WebSite = require('./lib/host.js');
const { app, BrowserWindow, dialog, globalShortcut, protocol } = require('electron');
require('electron-reload')(__dirname);
const File = require('./lib/File.js');
const SystemTray = require('./lib/SystemTray.js');
const IAPI = require('./lib/InfinityAPI/api.js');
const SI = require('./lib/SI.js');
const Package = require('./package.json');
const chalk = require('chalk');
const Promise = require("bluebird");

let notifier = null;
let mainWindow = null;
let lastSessionInfoDB = null;
let optionsDB = null;
let argv = sliceArgv(process.argv);
let shouldQuit = false;
let protocol_default = 'infinityapp';

if (process.platform === 'win32') {
    const squirrelWin32 = require('./lib/squirrel-win32');
    shouldQuit = squirrelWin32.handleEvent(argv[0]);
    argv = argv.filter(function(arg) { return !arg.includes('--squirrel'); });
}

if (!shouldQuit) {
    shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    if (shouldQuit) {
        app.quit();
    }
}

function sliceArgv(argv) {
    return argv.slice(production() ? 1 : dev() ? 4 : 2)
}

function getData() {
    return new Promise(async resolve => {
        lastSessionInfoDB.findOne({ id: 'global' }).then(data => {
            if (!data) return resolve(lastSessionInfoDB.new());
            return resolve(data);
        });
    });
}

async function startDB() {
    lastSessionInfoDB = await require('./lib/Database/database_ops.js').lastSessionInfoDB;
    optionsDB = await require('./lib/Database/database_ops.js').optionsDB;
}

async function startApp() {
    if (mainWindow != null) {
        return;
    }

    await startDB();
    let lastSessionInfoData = await getData();

    WebSite.init(optionsDB);

    console.log("[ready] Criando janela...");

    let lastSessionInfo = lastSessionInfoData ? lastSessionInfoData : {
        size: {
            width: 1000,
            height: 600
        },
        position: {
            x: 0,
            y: 0
        },
        isMaximize: false
    };

    var mainWindowOptions = {
        title: "InfinityApp",
        icon: __dirname + './img/logo@32X32.png',
        width: lastSessionInfo.size.width,
        height: lastSessionInfo.size.height,
        x: lastSessionInfo.position.x,
        y: lastSessionInfo.position.y,
        minWidth: 1000,
        minHeight: 600,
        backgroundColor: '#000000',
        transparent: false,
        frame: false,
        resizable: true,
        show: true,
        webPreferences: {
            devTools: false
        }
    };

    if (dev()) {
        mainWindowOptions.webPreferences.devTools = true;
    }

    mainWindow = new BrowserWindow(mainWindowOptions);
    mainWindowOptions = null;

    globalShortcut.unregisterAll();
    app.setAsDefaultProtocolClient(protocol_default)
    app.setAppUserModelId(Package.name);
    app.setName(Package.name);

    var handler = (req, cb) => {
        dialog.showErrorBox('Welcome Back', `You arrived from: ${req.url}`);
        cb();
    };

    protocol.registerStringProtocol(protocol_default, handler, (err) => {
        if (err) console.log(err);
    });

    // SI(function(list) {
    //     console.log(list);
    // });

    mainWindow.webContents.on('devtools-opened', function() {
        return;
    });

    mainWindow.on('page-title-updated', function(e, title) {
        e.preventDefault();
        if (title != "InfinityApp") {
            title += " - InfinityApp";
        }
        mainWindow.setTitle(title);
    });

    mainWindow.on('maximize', async function(e) {
        await lastSessionInfo.update({ "isMaximize": true });
    });

    mainWindow.on('unmaximize', async function(e) {
        await lastSessionInfo.update({ "isMaximize": false });
    });

    if (lastSessionInfo.isMaximize) {
        mainWindow.maximize();
    }

    SystemTray(mainWindow, lastSessionInfo);

    mainWindow.loadURL("http://localhost:8000/");
    console.log(`[ready] Estou pronto!`);
}

app.on('open-url', function(event, url) {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
});

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
        mongod.kill();
    }
});

app.on('ready', startApp);

//===================Process handler===================//
process.on('unhandledRejection', function(err, p) {
    console.log(chalk.green("//===================Error Promise===================//"));
    console.log(chalk.red('Unhandled Rejection at: Promise \n', JSON.stringify(p), "\n\nReason:", err.stack));
    console.log(chalk.green("//===================Error Promise===================//"));
});

process.on('uncaughtException', function(err) {
    console.log(chalk.green("//===================Error===================//"));
    console.log(chalk.red('EXCEPTION:'));
    console.log(chalk.red(err.stack));
    console.log(chalk.green("//===================Error===================//"));
});