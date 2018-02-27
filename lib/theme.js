var folder_theme = `${process.env.APPDATA}/InfinityApp`;
var fs = require('fs');
var File = require('./File.js');
var path = require('path');
var isDev = require('electron-is').dev();

var themes = [];
var datathemes = [];
var datawallpaper = [];
var dataobj = {};

// if folder doesn't exist
if (!fs.existsSync(folder_theme + '/themes')) {
    fs.mkdirSync(folder_theme + '/themes');
    fs.chmodSync(folder_theme + '/themes', '777');
}

if (!fs.existsSync(folder_theme + '/wallpaper')) {
    fs.mkdirSync(folder_theme + '/wallpaper');
    fs.chmodSync(folder_theme + '/wallpaper', '777');
}

var mainpath;

if (isDev) {
    mainpath = path.resolve(`./`);
} else {
    mainpath = path.resolve(process.cwd(), `./resources/app.asar`);
}

function themeUpdate() {
    File.getAllFiles('themes', files => {
        files.forEach(function(fileName) {
            if (!fileName.endsWith(".theme.css")) {
                console.log("[theme] Theme invalido detectado " + fileName);
                return;
            }
            var theme = fs.readFileSync(`${folder_theme}/themes/${fileName}`, 'utf8');
            var split = theme.split("\n");
            var meta = split[0];
            if (meta.indexOf('META') < 0) {
                console.log("[theme] Theme META not found in file: " + fileName);
                return;
            }
            var themeVar = meta.substring(meta.lastIndexOf('//META') + 6, meta.lastIndexOf('*//'));
            var themeInfo;
            try {
                themeInfo = JSON.parse(themeVar);
            } catch (err) {
                console.log("[theme] Failed to parse theme META in file: " + fileName + "(" + err + ")");
                return;
            }

            if (themeInfo['name'] == undefined) {
                console.log("[theme] Missing theme name in file: " + fileName);
                return;
            }
            if (themeInfo['author'] == undefined) {
                themeInfo['author'] = "Unknown";
                console.log("[theme] Missing author name in file: " + fileName);
            }
            if (themeInfo['description'] == undefined) {
                themeInfo['description'] = "No_Description";
                console.log("[theme] Missing description in file: " + fileName);
            }
            if (themeInfo['version'] == undefined) {
                themeInfo['version'] = "Unknown";
                console.log("[theme] Missing version in file: " + fileName);
            }

            console.log("[theme] Loading theme: " + themeInfo['name']);

            var checkin = {
                "enabled": false,
                "name": themeInfo['name'],
                "css": `/base/themes/${fileName}`,
                "description": themeInfo['description'],
                "author": themeInfo['author'],
                "version": themeInfo['version']
            }

            dataobj[checkin.name] = false;

            if (themes.indexOf(checkin) < 0) {
                themes.push(checkin);
            }
            if (datathemes.indexOf(dataobj) < 0) {
                datathemes.push(dataobj);
            }
            dataobj = {};
        });
    });
}

function themewallpaper() {
    fs.readdir(folder_theme + '/wallpaper', (err, files) => {
        for (let i = 0; i < files.length; i++) {
            if (datawallpaper.indexOf(files[i]) < 0) {
                datawallpaper.push(files[i]);
            }
        }
    });
}

function UpThemeList() {
    themewallpaper();
    themeUpdate();
}

setTimeout(UpThemeList, 500);

module.exports = {
    themes,
    datathemes,
    datawallpaper,
    themeUpdate,
    themewallpaper,
    UpThemeList
}