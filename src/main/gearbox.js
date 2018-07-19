const fs = require('fs');

global.gearbox = {

    /**
     * @param {String} src Path of component 
     * @returns {NodeModule | Error}
     */
    Component: (src) => {
        return fs.existsSync(`${__dirname}/${src}/index.js`) ? require(`${__dirname}/${src}/index.js`) : new Error('index.js not provided.');
    },

    /**
     * @param {String} module Name or Path of module 
     * @returns {NodeModule}
     */
    GetFromMain: (module) => {
        return require(`${__dirname}/${module}`);
    }
}