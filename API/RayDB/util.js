"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param length Tamanho de caracteres que o ID terá
 * @param type Tipos de caracteres que é permitido conter no ID, por padrão o valor é ``0``.
 *
 * ``0`` — Permite letras maiúscula, minúscula e números
 *
 * ``1`` — Permite letras maiúscula e minúscula
 *
 * ``2`` — Permite apenas letras maiúscula
 *
 * ``3`` — Permite apenas letras minúscula
 *
 * ``4`` — Permite apenas números
 */
function createID(length, type = 0) {
    let base = '', r = '';
    if (type < 0 || type > 4)
        return;
    switch (type) {
        case 1:
            base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            break;
        case 2:
            base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            break;
        case 3:
            base = 'abcdefghijklmnopqrstuvwxyz';
            break;
        case 4:
            base = '0123456789';
            break;
        default:
            base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            break;
    }
    for (let i = 0; i < length; i++) {
        const c = base.charAt(Math.random() * base.length);
        r += c;
    }
    return r;
}
exports.createID = createID;
//- Randomizer
function randomize(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.randomize = randomize;
//- Number shorter
function miliarize(numstring, strict) {
    if (typeof numstring == 'number') {
        numstring = numstring.toString();
    }
    if (numstring.length < 4)
        return numstring;
    //-- -- -- -- --
    let stashe = numstring.replace(/\B(?=(\d{3})+(?!\d))/g, '.').toString();
    let stash;
    // Gibe precision pls
    if (strict) {
        stash = stashe.split('.');
        switch (stash.length) {
            case 1:
                return stash;
            case 2:
                if (stash[1] != '000')
                    break;
                return stash[0] + 'K';
            case 3:
                if (stash[2] != '000')
                    break;
                return stash[0] + '.' + stash[1][0] + stash[1][1] + 'Mi';
            case 4:
                if (stash[3] != '000')
                    break;
                return stash[0] + '.' + stash[1][0] + stash[1][1] + 'Bi';
        }
        return stashe;
    }
    // Precision is not a concern
    stash = stashe.split('.');
    switch (stash.length) {
        case 1:
            return stash.join(' ');
        case 2:
            if (stash[0].length <= 1)
                break;
            return stash[0] + 'K';
        case 3:
            return stash[0] + 'Mi';
        case 4:
            return stash[0] + 'Bi';
    }
    return stashe;
}
exports.miliarize = miliarize;
//- Wait on Secs
async function wait(time) {
    time = typeof time == 'number' ? time : 1000;
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, time * 1000 || 1000);
    });
}
exports.wait = wait;
//- Capitalize
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalize = capitalize;
function bytesToSize(bytes) {
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    if (bytes == 0)
        return '0 Byte';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}
exports.bytesToSize = bytesToSize;
/**
 *
 * @example filterToFormats('mp3')
 * @param {string} format)
 */
function filterToFormats(format) {
    let formats = ['mp3', 'ogg', 'aac', 'png', 'jpeg', 'jpg', 'webp', 'mp4', 'avi', 'mkv'];
    return formats.includes(format);
}
exports.filterToFormats = filterToFormats;
