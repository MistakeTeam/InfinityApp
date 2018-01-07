'use static';

const { autoUpdater } = require('electron');

autoUpdater.setFeedURL("https://github.com/xDeltaFox/InfinityApp/releases/latest/");

function autoUpdate(sendStatusToWindow) {
    autoUpdater.on('checking-for-update', () => {
        sendStatusToWindow('updatetext', 'Buscando atualizações...');
    });

    autoUpdater.on('update-available', (info) => {
        sendStatusToWindow('updatetext', 'Atualização disponivel');
    });

    autoUpdater.on('update-not-available', (info) => {
        sendStatusToWindow('updatetext', 'Está é a ultima versão.');
    });

    autoUpdater.on('error', (err) => {
        sendStatusToWindow('updatetext', 'Erro ao atualizar.');
    });

    autoUpdater.on('download-progress', (progressObj) => {
        let speed = ((progressObj.bytesPerSecond / 1000) / 1000).toFixed(1);
        let transferred = ((progressObj.transferred / 1000) / 1000).toFixed(1);
        let total = ((progressObj.total / 1000) / 1000).toFixed(1);
        let percent = progressObj.percent.toFixed(1);

        let log_message = "Velocidade: " + speed + " Mb/s";
        log_message = log_message + ' - Baixado: ' + percent + '%';
        log_message = log_message + ' (' + transferred + "/" + total + ')';
        sendStatusToWindow('updatetext', log_message);
    });

    autoUpdater.on('update-downloaded', (info) => {
        sendStatusToWindow('updatetext', 'Atualização baixada, em 5 segundos será instalada.');

        setTimeout(function() {
            autoUpdater.quitAndInstall();
        }, 5000);
    });
}

module.exports = { autoUpdate, autoUpdater };