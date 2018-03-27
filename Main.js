'use static';
process.title = 'InfinityApp';

//open mongod
var mongod = require('child_process').execFile(`C:\\Program Files\\MongoDB\\Server\\3.6\\bin\\mongod.exe`);

const env = require('./env.js');
const WebSite = require('./lib/host.js');
const fs = require('fs');
const { app, BrowserWindow, dialog, protocol } = require('electron');
require('electron-reload')(__dirname);
const { production, dev } = require('electron-is');
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
        mongod.kill();
    }
}

function sliceArgv(argv) {
    return argv.slice(production ? 1 : dev ? 4 : 2)
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
}

async function startApp() {
    if (mainWindow != null) {
        return;
    }

    await startDB();
    let lastSessionInfoData = await getData();

    console.log("[ready] Criando janela...");

    let lastSessionInfo = lastSessionInfoData ? lastSessionInfoData : {
        size: {
            width: 1080,
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
        minWidth: 1080,
        minHeight: 600,
        backgroundColor: '#DBC392',
        transparent: false,
        frame: false,
        resizable: true,
        show: true
    };

    if (!dev) {
        mainWindowOptions.webPreferences.devTools = false;
    }

    mainWindow = new BrowserWindow(mainWindowOptions);
    mainWindowOptions = null;

    app.setAsDefaultProtocolClient(protocol_default)
    app.setAppUserModelId(Package.name);
    app.setName(Package.name);
    // app.setAboutPanelOptions({
    //     applicationName: Package.name,
    //     applicationVersion: Package.version,
    //     copyright: `Copyright (C) 2018 - ${(new Date).getYear() + 1900} ${Package.author}`,
    //     version: Package.version
    // });

    protocol.registerHttpProtocol(protocol_default, (req, cb) => {
        dialog.showErrorBox('Welcome Back', `You arrived from: ${req.url}`)
    });

    // SI(function(list) {
    //     console.log(list);
    // });

    mainWindow.on('page-title-updated', function(e, title) {
        e.preventDefault();
        title += " - InfinityApp";
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