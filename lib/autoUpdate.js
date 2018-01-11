'use static';

const { autoUpdater, remote } = require('electron');
const { EventEmitter } = require('events');

autoUpdater.setFeedURL("https://github.com/xDeltaFox/InfinityApp/releases/latest/");

class AutoUpdate extends EventEmitter {
    init() {
        autoUpdater.on('checking-for-update', () => {
            this.on('checking-for-update', (msg) => {

            });
        });

        autoUpdater.on('update-available', (info) => {
            this.on('update-available', (msg) => 'Atualização disponivel');
        });

        autoUpdater.on('update-not-available', (info) => {
            this.on('update-not-available', (msg) => 'Está é a ultima versão.');
        });

        autoUpdater.on('error', (err) => {
            this.on('error', (msg) => 'Erro ao atualizar.');
        });

        autoUpdater.on('download-progress', (progressObj) => {
            let speed = ((progressObj.bytesPerSecond / 1000) / 1000).toFixed(1);
            let transferred = ((progressObj.transferred / 1000) / 1000).toFixed(1);
            let total = ((progressObj.total / 1000) / 1000).toFixed(1);
            let percent = progressObj.percent.toFixed(1);

            let log_message = `Velocidade: ${speed} Mb/s - Baixado: ${percent}% (${transferred}/${total})`;
            this.on('download-progress', () => log_message);
        });

        autoUpdater.on('update-downloaded', (info) => {
            this.on('update-downloaded', (msg) => 'Atualização baixada, em 5 segundos será instalada.');

            setTimeout(function() {
                autoUpdater.quitAndInstall();
            }, 5000);
        });
    }

    check() {
        this.emit('checking-for-update', 'Buscando atualizações...');
    }
}

module.exports = AutoUpdate;