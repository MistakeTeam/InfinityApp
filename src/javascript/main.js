const { ipcRenderer, remote } = require('electron');

ipcRenderer.on('windows-focus-effects', (event, arg) => {
    if (!$('.titlebar').hasClass('titlebar-windows-focus')) {
        $('.titlebar').addClass('titlebar-windows-focus');
    }
});

ipcRenderer.on('windows-blur-effects', (event, arg) => {
    if ($('.titlebar').hasClass('titlebar-windows-focus')) {
        $('.titlebar').removeClass('titlebar-windows-focus');
    }
});