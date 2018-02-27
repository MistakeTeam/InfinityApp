var File;
var themes;
var eventEmitter;
var path = require('path');

try {
    File = require(path.resolve(process.cwd(), './lib/File.js'));
    themes = require(path.resolve(process.cwd(), './lib/theme.js'));
    eventEmitter = require(path.resolve(process.cwd(), './lib/events.js')).eventEmitter;
} catch (err) {
    File = require(path.resolve(process.cwd(), './resources/app.asar/lib/File.js'));
    themes = require(path.resolve(process.cwd(), './resources/app.asar/lib/theme.js'));
    eventEmitter = require(path.resolve(process.cwd(), './resources/app.asar/lib/events.js')).eventEmitter;
}

function checkTheme() {
    File.ReadFile('options.json', db => {
        var data = db;

        if (data.themeCookie.length > themes.datathemes.length) {
            console.log('Adicionando temas');
            data.themeCookie = themes.datathemes;
        }
        var themeCookie = data.themeCookie;

        themeCookie.forEach((themedata) => {
            themes.themes.forEach((theme) => {
                var name = theme.name;

                if (themedata[name] == true) {
                    console.log(`Ativando tema: ${name}`);
                    if ($(`#${name}`).length <= 0) {
                        $("head").append(`<link rel="stylesheet" id="${name}" href="${theme.css}">`);
                    }
                    $(`#${theme.author}-${theme.name}`).attr('data-check', 'true');
                    $(`#${theme.author}-${theme.name}`).attr('checked', '');
                    $(`#${theme.author}-${theme.name}`).attr('active', '');
                } else if (themedata[name] == false) {
                    console.log(`Desativando tema: ${name}`);
                    $(`#${name}`).remove();
                    $(`#${theme.author}-${theme.name}`).attr('data-check', 'false');
                    $(`#${theme.author}-${theme.name}`).removeAttr('checked');
                    $(`#${theme.author}-${theme.name}`).removeAttr('active');
                }
            });
        });

        if (data.options.wallpaper != undefined || data.options.wallpaper != "") {
            $('.blur').css('background', `url(${data.options.wallpaper}) round`);
        }

        File.SaveFile('options.json', JSON.stringify(data));
        data = null;
    });
}

function refreshtheme() {
    $('#theme-list').children().remove();
    $('#wallpaper-list').children().remove();

    themes.themes.forEach((theme) => {
        $('#theme-list').append(`
        <div class="contain-theme">
            <div class="lost-tab-top">
                <div class="contain-tab">
                    <span class="tab-title">${theme.name}</span>
                    <div class="lost-more-info">
                        <span class="more-title-info">Autor:</span>
                        <span class="more-info">${theme.author}</span>
                        <span class="more-title-info">Versão:</span>
                        <span class="more-info">${theme.version}</span>
                    </div>
                </div>
                <div class="switch" theme>
                    <div class="cmn-toggle cmn-toggle-round" data-theme-name="${theme.name}" data-author-name="${theme.author}" data-check="false" id="${theme.author}-${theme.name}"></div>
                    <label></label>
                </div>
            </div>
            <div class="lost-tab-bottom">
                <span class="tab-description">${theme.description}</span>
            </div>
        </div>
        `);
    });

    themes.datawallpaper.forEach(wallpaper => {
        $('#wallpaper-list').append(`
        <div class="contain-wallpaper">
            <img src="base/wallpaper/${wallpaper}"></img>
        </div>
        `);
    });

    $('.contain-wallpaper').click(wallpaperclick);
}

function wallpaperclick(event) {
    $('.blur').css('background', `url(${$(this).children().attr('src')}) round`);
    File.ReadFile('options.json', db => {
        db.options.wallpaper = $(this).children().attr('src');
        File.SaveFile('options.json', JSON.stringify(db));
    });
}

setTimeout(() => {
    checkTheme();
}, 1000);
eventEmitter.on('checkTheme', checkTheme);
eventEmitter.on('refreshtheme', refreshtheme);