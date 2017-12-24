var File;
var themes;
var eventEmitter;

try {
    File = require(path.resolve(process.cwd(), './File.js'));
    themes = require(path.resolve(process.cwd(), './theme.js'));
    eventEmitter = require(path.resolve(process.cwd(), './events.js')).eventEmitter;
} catch (err) {
    File = require(path.resolve(process.cwd(), './resources/app/File.js'));
    themes = require(path.resolve(process.cwd(), './resources/app/theme.js'));
    eventEmitter = require(path.resolve(process.cwd(), './resources/app/events.js')).eventEmitter;
}

function checkTheme() {
    File.ReadFile('options.json', db => {
        var data = JSON.parse(db);

        if (data.themeCookie == []) {
            data.themeCookie = themes.datathemes;
        }
        var themeCookie = data.themeCookie;

        themeCookie.forEach((themedata) => {
            themes.themes.forEach((theme) => {
                var name = theme.name;
                if (themedata[name] == true) {
                    $("head").append(`<link rel="stylesheet" id="${name}" href="${theme.css}">`);
                    $(`#${theme.author}-${theme.name}`).attr('data-check', 'true');
                    $(`#${theme.author}-${theme.name}`).attr('checked', '');
                    $(`#${theme.author}-${theme.name}`).attr('active', '');
                } else if (themedata[name] == false) {
                    $(`#${name}`).remove();
                    $(`#${theme.author}-${theme.name}`).attr('data-check', 'false');
                    $(`#${theme.author}-${theme.name}`).removeAttr('checked', '');
                    $(`#${theme.author}-${theme.name}`).removeAttr('active', '');
                }
            });
        });

        File.SaveFile('options.json', JSON.stringify(data));
    });
}

setTimeout(() => {
    checkTheme();
}, 1000);

eventEmitter.on('checkTheme', checkTheme);