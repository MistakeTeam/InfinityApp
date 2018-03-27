const electron = require('electron');

module.exports = {
    createWin: function() {
        let pipWin = electron.BrowserWindow({
            title: "PIP",
            width: 320,
            height: 480,
            x: 200,
            y: 200,
            minWidth: 320,
            minHeight: 480,
            transparent: false,
            frame: false,
            resizable: true
        });
    }
}