var folder_theme = `${process.env.APPDATA}/InfinityApp/themes`;
var fs = require('fs');
var File = require('./File.js');
var path = require('path');
var isDev = require('electron-is').dev();

var themes = [];
var datathemes = [];
var dataobj = {};

if (!fs.existsSync(folder_theme)) {
    fs.mkdirSync(folder_theme);
    fs.chmodSync(folder_theme, '777');
}

var mainpath;

if (isDev) {
    mainpath = path.resolve(`./`);
} else {
    mainpath = path.resolve(process.cwd(), `./resources/app.asar`);
}

if (!fs.existsSync(`${folder_theme}/dark.theme.css`)) {
    fs.readFile(`${mainpath}/to/dark.theme.css`, function(err, data) {
        if (!err) {
            fs.writeFile(`${folder_theme}/dark.theme.css`, data);
        }
    });
}

if (!fs.existsSync(`${folder_theme}/white.theme.css`)) {
    fs.readFile(`${mainpath}/to/white.theme.css`, function(err, data) {
        if (!err) {
            fs.writeFile(`${folder_theme}/white.theme.css`, data);
        }
    });
}

function themeUpdate() {
    File.getAllFiles('themes', files => {
        files.forEach(function(fileName) {
            if (!fileName.endsWith(".theme.css")) {
                console.log("[theme] Theme invalido detectado " + fileName);
                return;
            }
            var theme = fs.readFileSync(`${folder_theme}/${fileName}`, 'utf8');
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

            if (checkin.name == "Dark") {
                checkin.enabled = true;
                dataobj[checkin.name] = true;
            } else {
                dataobj[checkin.name] = false;
            }

            themes.push(checkin);
            datathemes.push(dataobj);
            dataobj = {};
        });
    });
}

setTimeout(() => {
    themeUpdate();
}, 500);

module.exports = {
    themes,
    datathemes,
    themeUpdate
}