const events = require('events');
// const Rich = require('./discord-rich-presence/rich.js');
var eventEmitter = new events.EventEmitter();

// eventEmitter.on('closeDiscordRPC', Rich.deactivate);
console.log(eventEmitter);

module.exports = {
    eventEmitter
}