const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');

getInstallerConfig()
    .then(createWindowsInstaller)
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

function getInstallerConfig() {
    console.log('creating windows installer');
    const rootPath = path.join('./');
    const outPath = path.join(rootPath, 'dist');

    return Promise.resolve({
        appDirectory: path.join(outPath, 'InfinityApp-win32-ia32/'),
        authors: 'xDeltaFox',
        noMsi: true,
        outputDirectory: path.join(outPath, 'built-installers'),
        description: 'InfinityApp',
        exe: 'InfinityApp.exe',
        setupExe: 'InfinityApp.exe',
        setupIcon: path.join(rootPath, 'img', 'logo.ico')
    });
}