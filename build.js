"use strict"

// const builder = require("electron-builder");
// const Platform = builder.Platform;
// const path = require('path');
// const rootPath = path.join('./');
// const outPath = path.join(rootPath, 'dist');

// // Promise is returned
// builder.build({
//         targets: Platform.WINDOWS.createTarget(),
//         config: {
//             appId: "com.mistake.infinityapp",
//             productName: "InfinityApp",
//             copyright: "Copyright © 2018 Mistake Team",
//             directories: {
//                 output: path.join(outPath, 'built-installers'),
//                 buildResources: path.join(outPath, 'InfinityApp-win32-ia32/')
//             },
//             win: {
//                 asar: true,
//                 icon: path.join(rootPath, 'img', 'logo.ico'),
//                 target: "squirrel"
//             },
//             squirrelWindows: {
//                 iconUrl: "https://github.com/MistakeTeam/InfinityApp/blob/master/img/logo.ico?raw=true"
//             }
//         }
//     })
//     .then(() => {
//         console.log('[build] creating windows installer');
//     })
//     .catch((error) => {
//         console.log('[build] Error with windows installer\n' + error);
//     });

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');

getInstallerConfig()
    .then(createWindowsInstaller)
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

function getInstallerConfig() {
    console.log('[build] creating windows installer');
    const rootPath = path.join('./');
    const outPath = path.join(rootPath, 'dist');

    return Promise.resolve({
        appDirectory: path.join(outPath, 'InfinityApp-win32-ia32/'),
        authors: 'xDeltaFox',
        noMsi: true,
        fixUpPaths: true,
        outputDirectory: path.join(outPath, 'built-installers'),
        description: 'InfinityApp',
        exe: 'InfinityApp.exe',
        setupExe: `InfinitySetup.exe`,
        setupIcon: path.join(rootPath, 'img', 'logo.ico')
    });
}