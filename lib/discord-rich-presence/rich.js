"use strict";
var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
    return new(P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }

        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }

        function step(result) { result.done ? resolve(result.value) : new P(function(resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DiscordRPC = require('discord-rpc');
const events = require('events');
const IAPI = require('../InfinityAPI/api.js');
const path = require('path');
const notifier = require('../notifier.js');
const eventHandlers = new Set();
const electron = require('electron');

let rpc;
let appClient = '416967187476119561';
let start = new Date().getTime() / 1000;
let activity;
let activityTimer;

function getTime() {
    return start > start + 3600 ? start = new Date().getTime() / 1000 : start
}

function activate() {
    initRPC(appClient);
}
exports.activate = activate;

function deactivate() {
    return __awaiter(this, void 0, void 0, function*() {
        yield destroyRPC();
    });
}
exports.deactivate = deactivate;

function initRPC(clientID) {
    rpc = new DiscordRPC.Client({ transport: 'ipc' });
    rpc.once('ready', () => {
        setActivity();
        setTimeout(() => rpc.setActivity(activity), 500);
        rpc.transport.once('close', () => __awaiter(this, void 0, void 0, function*() {
            yield destroyRPC();
        }));
        activityTimer = setInterval(() => {
            if (!rpc) {
                clearInterval(activityTimer);
                return;
            }
            setActivity();
            rpc.setActivity(activity);
        }, 5000);
    });
    rpc.login(clientID).catch((error) => __awaiter(this, void 0, void 0, function*() {
        if (error.message.includes('ENOENT')) {
            notifier('Discord', {
                message: `Couldn't connect to Discord via RPC: ${error.message}`
            });
        } else {
            notifier('Discord', {
                message: 'No Discord Client detected!'
            });
        }
    }));
}

function destroyRPC() {
    return __awaiter(this, void 0, void 0, function*() {
        if (!rpc)
            return;
        if (activityTimer)
            clearInterval(activityTimer);
        activityTimer = null;
        eventHandlers.forEach(event => event.dispose());
        yield rpc.destroy();
        rpc = null;
    });
}

function setActivity() {
    if (!IAPI.object)
        return;

    let details;
    let state = IAPI.object.state;
    let largeImageKey;
    let largeImageText;

    if (IAPI.object.module.active) {
        details = IAPI.object.module.name;
    }

    activity = {
        details: details ? details : 'Idle',
        state: state,
        startTimestamp: getTime(),
        // endTimestamp: ``,
        largeImageKey: largeImageKey ? largeImageKey : 'infinity_logo',
        // smallImageKey: ``,
        largeImageText: largeImageText ? largeImageText : 'Infinityapp',
        // smallImageText: ``,
        instance: false,
    };
}