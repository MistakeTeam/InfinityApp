'use static';

process.title = 'InfinityApp';

const {
    app,
    BrowserWindow
} = require('electron');

require('electron-reload')(__dirname);

var File = require('./lib/File.js');
var mainWindows = require('./lib/MainWindows');
var splashWindows = require('./lib/SplashWindows');
var Website = require('./lib/host');
var Rich = require('./lib/discord-rich-presence/rich.js');
var event = require('./lib/events.js');

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

            mainWindows(data, splash, Rich);
        });
    });
    console.log(`Estou pronto!`);
});

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})