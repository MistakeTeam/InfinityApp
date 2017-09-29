var electronInstaller = require('electron-winstaller');
var fs = require('fs');

var settings = {
    appDirectory: './dist/InfinityApp-win32-x64',
    outputDirectory: './dist/built-installers',
    // loadingGif: '',
    authors: 'xDeltaFox.',
    exe: './InfinityApp.exe',
    description: 'test description',
    setupIcon: './img/logo.ico',
    setupExe: 'InfinityApp.exe',
    // iconUrl: './img/logo.ico',
    noMsi: false
};

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(() => {
    console.log("The installers of your application were succesfully created !");
}, (e) => {
    console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});