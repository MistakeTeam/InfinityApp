var electronInstaller = require('electron-winstaller');
var fs = require('fs');

var settings = {
    appDirectory: './dist/InfinityApp-win32-x64',
    outputDirectory: './dist/built-installers',
    // loadingGif: '',
    authors: 'xDeltaFox.',
    exe: './InfinityApp.exe',
    description: 'InfinityApp',
    setupIcon: './img/logo.ico',
    setupExe: 'InfinityApp.exe',
    iconUrl: 'https://raw.githubusercontent.com/xDeltaFox/InfinityApp/master/img/logo.ico',
    noMsi: true
};

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(() => {
    console.log("The installers of your application were succesfully created !");
}, (e) => {
    console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});