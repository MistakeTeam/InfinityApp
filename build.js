"use strict";

const builder = require("electron-builder");
const Platform = builder.Platform;
const path = require('path');
const rootPath = path.join('./');
const outPath = path.join(rootPath, 'dist');

// Promise is returned
builder.build()
    .then(() => {
        console.log('[build] creating windows installer');
    })
    .catch((error) => {
        console.log('[build] Error with windows installer\n' + error);
    });