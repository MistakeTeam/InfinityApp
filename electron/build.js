"use strict";

const builder = require("electron-builder");

builder.build()
    .then(() => {
        console.log('[build] creating windows installer');
    })
    .catch((error) => {
        console.log('[build] Error with windows installer\n' + error);
    });