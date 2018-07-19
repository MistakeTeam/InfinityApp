const fs = require('fs');

module.exports = {
    MenuTopbar: JSON.parse(fs.readFileSync(`${__dirname}/MenuTopbar.json`)).itens,
    ModuleApps: JSON.parse(fs.readFileSync(`${__dirname}/ModuleApps.json`)).itens
}