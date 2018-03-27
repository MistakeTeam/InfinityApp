const Schemas = require('./schemas.js');
const optionsDB = Schemas.Options;
const gamesDB = Schemas.Games;
const lastSessionInfoDB = Schemas.LastSessionInfo;
const Promise = require("bluebird");

optionsDB.new = function() {
    return new Promise(async resolve => {
        let instance = new optionsDB;
        instance.id = 'global';
        instance.save(function(e) {
            if (e) throw ["USER Database Save Failed", e];
            else resolve(optionsDB.findOne({ id: 'global' }));
        });
    });
};

lastSessionInfoDB.new = function() {
    return new Promise(async resolve => {
        let instance = new lastSessionInfoDB;
        instance.id = 'global';
        instance.save(function(e) {
            if (e) throw ["USER Database Save Failed", e];
            else resolve(lastSessionInfoDB.findOne({ id: 'global' }));
        });
    });
};

gamesDB.new = function() {
    return new Promise(async resolve => {
        let instance = new gamesDB;
        instance.id = 'global';
        instance.save(function(e) {
            if (e) throw ["USER Database Save Failed", e];
            else resolve(gamesDB.findOne({ id: 'global' }));
        });
    });
};

module.exports = { optionsDB, gamesDB, lastSessionInfoDB }

console.log("[Database] Database Ops OK!");