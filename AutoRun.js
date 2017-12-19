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
                callback;
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
}

module.exports = autoRun;