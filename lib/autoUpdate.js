'use static';

var { autoUpdater } = require('electron');

const scheduleUpdates = (EventEmitter) => {
    autoUpdater.setFeedURL(
        `https://github.com/xDeltaFox/InfinityApp/releases/latest/`
    );

    autoUpdater.on('checking-for-update', () => {
        EventEmitter.on('checking-for-update', (cb) => {
            if (typeof cb === 'function') {
                return cb('Buscando atualizações...');
            }
        });
    });

    autoUpdater.on('update-available', (info) => {
        EventEmitter.on('update-available', (cb) => {
            if (typeof cb === 'function') {
                return cb('Atualização disponivel');
            }
        });
    });

    autoUpdater.on('update-not-available', (info) => {
        EventEmitter.on('update-not-available', (cb) => {
            if (typeof cb === 'function') {
                return cb('Está é a ultima versão.');
            }
        });
    });

    autoUpdater.on('error', err => {
        EventEmitter.on('error', cb => {
            if (typeof cb === 'function') {
                return cb('Erro ao atualizar.');
            }
        });
    });

    autoUpdater.on('download-progress', (progressObj) => {
        let speed = ((progressObj.bytesPerSecond / 1000) / 1000).toFixed(1);
        let transferred = ((progressObj.transferred / 1000) / 1000).toFixed(1);
        let total = ((progressObj.total / 1000) / 1000).toFixed(1);
        let percent = progressObj.percent.toFixed(1);

        let log_message = `Velocidade: ${speed} Mb/s - Baixado: ${percent}% (${transferred}/${total})`;
        EventEmitter.on('download-progress', (cb) => {
            if (typeof cb === 'function') {
                return cb(log_message)
            }
        });
    });

    autoUpdater.on('update-downloaded', (info) => {
        EventEmitter.on('update-downloaded', (cb) => {
            if (typeof cb === 'function') {
                return cb('Atualização baixada, em 5 segundos será instalada.')
            }
        });

        setTimeout(function() {
            autoUpdater.quitAndInstall();
        }, 5000);
    });

    const checkForUpdates = () => {
        if (process.env.CONNECTION === 'offline') {
            return;
        }

        console.log('Check for update');
        autoUpdater.checkForUpdates();
    };

    // Check for updates at startup and once an hour
    setInterval(
        () => {
            checkForUpdates();
        },
        60 * 60 * 1000
    );
    setTimeout(
        () => {
            checkForUpdates();
        },
        10 * 1000
    );
};

module.exports = scheduleUpdates;