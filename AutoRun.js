'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var fs = require('fs');
var path = require('path');
var electron = require('electron');
var WindowsSystem = require('./WindowsSystem.js');

var autoRun = {
    update: function update() {},
    install: function install() {},
    isAutoRunning: function isAutoRunning() {},
    clear: function clear() {}
};

var appName = path.basename(process.execPath, '.exe');

if (process.platform === 'win32') {
    autoRun.install = function(callback) {
        var queue = [
            ['HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', '/v', appName, '/d', process.execPath]
        ];

        WindowsSystem.addToRegistry(queue, callback);
    };

    autoRun.update = function(callback) {
        autoRun.isAutoRunning(function(willRun) {
            if (willRun) {
                autoRun.install(callback);
            } else {
                callback();
            }
        });
    };

    autoRun.isAutoRunning = function(callback) {
        var queryValue = ['HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', '/v', appName];
        queryValue.unshift('query');
        WindowsSystem.spawnReg(queryValue, function(error, stdout) {
            var doesOldKeyExist = stdout.indexOf(appName) >= 0;
            callback(doesOldKeyExist);
        });
    };

    autoRun.clear = function(callback) {
        var queryValue = ['HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', '/v', appName, '/f'];
        queryValue.unshift('delete');
        WindowsSystem.spawnReg(queryValue, function(error, stdout) {
            callback();
        });
    };
} else if (process.platform === 'linux') {
    (function() {
        var ensureDir = function ensureDir() {
            try {
                fs.mkdirSync(autostartDir);
                return true;
            } catch (e) {
                // catch for when it already exists.
            }
            return false;
        };

        var writeStartupFile = function writeStartupFile(enabled, callback) {
            ensureDir();
            var desktopFile = desktopFileBase + ('X-GNOME-Autostart-enabled=' + enabled + '\n');
            try {
                fs.writeFile(autostartFileName, desktopFile, callback);
            } catch (e) {
                // I guess we don't autostart then
                callback();
            }
        };

        var exePath = electron.app.getPath('exe');
        var exeDir = path.dirname(exePath);
        var iconPath = path.join(exeDir, 'discord.png');
        var autostartDir = path.join(electron.app.getPath('appData'), 'autostart');
        var autostartFileName = path.join(autostartDir, electron.app.getName() + '-' + global.releaseChannel + '.desktop');
        var desktopFileBase = '[Desktop Entry]\nType=Application\nExec=' + exePath + '\nHidden=false\nNoDisplay=false\nName=' + appName + '\nIcon=' + iconPath + '\nComment=Text and voice chat for gamers.\n';

        autoRun.install = function(callback) {
            writeStartupFile(true, callback);
        };

        autoRun.update = function(callback) {
            // do I need this?
            callback();
        };

        autoRun.isAutoRunning = function(callback) {
            try {
                fs.readFile(autostartFileName, 'utf8', function(err, data) {
                    if (err) {
                        callback(false);
                        return;
                    }
                    var res = /X-GNOME-Autostart-enabled=true/.test(data);
                    callback(res);
                });
            } catch (e) {
                callback(false);
            }
        };

        autoRun.clear = function(callback) {
            writeStartupFile(false, callback);
        };
    })();
}

module.exports = autoRun;