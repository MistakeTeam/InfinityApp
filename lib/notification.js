const notify = require('./notify/notifier');
const notifier = new notify();

function fristNotifier() {
    const notification = notifier.notify('Bem-vindo', {
        message: 'Olá esse é um muilt-tarefas, ainda sem utilidades.',
        duration: 4.5
    })

    notification.on('clicked', () => {
        notification.close()
    })
}

function createNotifier(title, message, duration) {
    const notification = notifier.notify(title, {
        message: message,
        duration: duration ? duration : 4.5
    })

    notification.on('clicked', () => {
        notification.close()
    })
}

module.exports = {
    createNotifier: createNotifier,
    fristNotifier: fristNotifier
};