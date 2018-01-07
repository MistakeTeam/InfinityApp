const DiscordRPC = require('discord-rpc'),
    events = require('events'),
    fs = require('fs'),
    path = require('path'),
    rpc = new DiscordRPC.Client({ transport: 'ipc' }),
    appClient = '385523660301271040';

var start = new Date().getTime() / 1000;

function getTime() {
    return start > start + 3600 ? start = new Date().getTime() / 1000 : start
}

async function checkPresence(dataPresence) {
    rpc.setActivity(dataPresence);

    console.log(`Updated Presence`);
}

// rpc.on('ready', () => {
//     log(`Connected to Discord! (${appClient})`);

//     checkPresence();
// });

// rpc.login(appClient).catch(console.error);

module.exports = { rpc, checkPresence, appClient, getTime }