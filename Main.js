'use static';

process.title = 'InfinityApp';

const {
    app,
    BrowserWindow
} = require('electron');

require('electron-reload')(__dirname);

const { production, dev } = require('electron-is');
const File = require('./lib/File.js');
const mainWindows = require('./lib/MainWindows');
const splashWindows = require('./lib/SplashWindows');
const Website = require('./lib/host');
const Rich = require('./lib/discord-rich-presence/rich.js');
const event = require('./lib/events.js');

var shouldQuit = false
var argv = sliceArgv(process.argv)

if (process.platform === 'win32') {
    var squirrelWin32 = require('./lib/squirrel-win32')
    shouldQuit = squirrelWin32.handleEvent(argv[0])
    argv = argv.filter(function(arg) { return !arg.includes('--squirrel'); })
}

if (!shouldQuit) {
    // Prevent multiple instances of app from running at same time.
    shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (myWindow) {
            if (myWindow.isMinimized()) myWindow.restore()
            myWindow.focus()
        }
    });

    if (shouldQuit) {
        app.quit()
    }
}

app.on('ready', function() {
    splashWindows(splash => {
        File.ReadFile('options.json', data => {
            if (data.themeCookie == null) {
                data.themeCookie = [];
            }

            if (data.options == null) {
                data.options = {};
            }

            if (data.options.AnimationRun == null) {
                data.options.AnimationRun = false;
            }

            if (data.fristNotifier == null) {
                data.fristNotifier = true;
            }

            if (data.lastSessionInfo == null) {
                data.lastSessionInfo = { size: { width: 1024, height: 720 }, position: { x: null, y: null } };
            }

            File.SaveFile('options.json', JSON.stringify(data));

            if (!shouldQuit) {
                mainWindows(data, splash, Rich);
            }
        });
    });
    console.log(`Estou pronto!`);
});

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

function sliceArgv(argv) {
    return argv.slice(production ? 1 : dev ? 4 : 2)
}