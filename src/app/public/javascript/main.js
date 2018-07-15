const { ipcRenderer, remote } = require('electron'), path = require('path'), { dev } = require('electron-is');

//Default path
let path_default = dev() ? path.resolve('./src/main') : path.resolve('./src/main')

//Start events from ipcRenderer
require(path.resolve(`${path_default}/Renderer/icp.js`))(ipcRenderer);