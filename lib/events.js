const events = require('events');
const Rich = require('./discord-rich-presence/rich.js');
var eventEmitter = new events.EventEmitter();
var NotificationWindow = require('./notification');

async function ongames() {
    Rich.checkPresence({
        details: `idle`,
        state: `in Games`,
        startTimestamp: Rich.getTime(),
        // endTimestamp: ``,
        largeImageKey: `infinity_logo`,
        // smallImageKey: ``,
        largeImageText: `InfinityApp`,
        // smallImageText: ``,
        instance: false,
    });
}

async function onplayer() {
    Rich.checkPresence({
        details: `idle`,
        state: `in Player`,
        startTimestamp: Rich.getTime(),
        // endTimestamp: ``,
        largeImageKey: `infinity_logo`,
        // smallImageKey: ``,
        largeImageText: `InfinityApp`,
        // smallImageText: ``,
        instance: false,
    });
}

async function onmain() {
    Rich.checkPresence({
        details: `idle`,
        state: `in Menus`,
        startTimestamp: Rich.getTime(),
        // endTimestamp: ``,
        largeImageKey: `infinity_logo`,
        // smallImageKey: ``,
        largeImageText: `InfinityApp`,
        // smallImageText: ``,
        instance: false,
    });
}

eventEmitter.on('ongames', ongames);
eventEmitter.on('onplayer', onplayer);
eventEmitter.on('onmain', onmain);
console.log(eventEmitter);

module.exports = {
    eventEmitter
}