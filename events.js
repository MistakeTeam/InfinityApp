const events = require('events');
const Rich = require('./lib/discord-rich-presence/rich.js');
const log = require("fancy-log");

var eventEmitter = new events.EventEmitter();
var start = new Date().getTime() / 1000;
var NotificationWindow = require('./notification');

async function onplayer() {
    log.info('Calling `onplayer` event');
    Rich.checkPresence({
        details: `idle`,
        state: `in Player`,
        startTimestamp: start > start + 3600 ? start = new Date().getTime() / 1000 : start,
        // endTimestamp: ``,
        largeImageKey: `infinity_logo`,
        // smallImageKey: ``,
        largeImageText: `InfinityApp`,
        // smallImageText: ``,
        instance: false,
    });

    // NotificationWindow.createNotifier('Rich Presence', 'A rich presence foi ativado no discord', 9999);
}

eventEmitter.on('onplayer', onplayer);
log.info(eventEmitter);

module.exports = { eventEmitter }