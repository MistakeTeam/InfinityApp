const { ipcRenderer, remote } = require('electron');

//Start events from ipcRenderer
require('./icp.js')(ipcRenderer);