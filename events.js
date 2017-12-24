const events = require('events');
const Rich = require('./lib/discord-rich-presence/rich.js');


var eventEmitter = new events.EventEmitter();
var start = new Date().getTime() / 1000;
var NotificationWindow = require('./notification');

async function onplayer() {
    console.log('Calling `onplayer` event');
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
console.log(eventEmitter);

module.exports = { eventEmitter }