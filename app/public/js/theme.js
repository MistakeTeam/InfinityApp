'use strict';

let folder_theme = `${process.env.APPDATA}/InfinityApp`;
let themes = [];
let datawallpaper = [];

// if folder doesn't exist
if (!fs.existsSync(folder_theme + '/themes')) {
    fs.mkdirSync(folder_theme + '/themes');
    fs.chmodSync(folder_theme + '/themes', '777');
}

if (!fs.existsSync(folder_theme + '/wallpaper')) {
    fs.mkdirSync(folder_theme + '/wallpaper');
    fs.chmodSync(folder_theme + '/wallpaper', '777');
}

function findByAttr(arr, attr, value) {
    var i = arr.length;
    while (i--) {
        if (value != undefined) {
            if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
                return i;
            }
        } else {
            if (arr[i] && arr[i].hasOwnProperty(attr)) {
                return i;
            }
        }
    }
    return -1;
}

async function themeUpdate() {
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

            fs.readFile(`${folder_theme}/themes/${fileName}`, (err, data) => {
                var checkin = {
                    "enabled": false,
                    "name": themeInfo['name'],
                    "css": data,
                    "description": themeInfo['description'],
                    "author": themeInfo['author'],
                    "version": themeInfo['version'],
                    "ID": themeInfo['author'] + "-" + themeInfo['name']
                }

                if (findByAttr(themes, 'ID', checkin.ID) < 0) {
                    themes.push(checkin);
                }
            });
        });
    });
}

async function themewallpaper() {
    fs.readdir(folder_theme + '/wallpaper', (err, files) => {
        for (let i = 0; i < files.length; i++) {
            if (datawallpaper.indexOf(files[i]) < 0) {
                datawallpaper.push(files[i]);
            }
        }
    });
}

async function checkTheme() {
    setTimeout(async() => {
        console.log(`[checkTheme] Verificando temas...`);
        themes.forEach((theme) => {
            if (optionData.themeCookie[theme.ID] == true) {
                console.log(`[checkTheme] Ativando tema: ${theme.name}`);
                if ($(`#${theme.name}`).length <= 0) {
                    $("head").append(`<style type="text/css" id="${theme.name}">${theme.css}</style>`);
                }
                $(`#${theme.ID}`).attr('data-check', 'true');
                $(`#${theme.ID}`).attr('checked', '');
                $(`#${theme.ID}`).attr('active', '');
            } else if (optionData.themeCookie[theme.ID] == false) {
                console.log(`[checkTheme] Desativando tema: ${theme.name}`);
                $(`#${theme.name}`).remove();
                $(`#${theme.ID}`).attr('data-check', 'false');
                $(`#${theme.ID}`).removeAttr('checked');
                $(`#${theme.ID}`).removeAttr('active');
            }
        });

        if (optionData.options.wallpaper != undefined || optionData.options.wallpaper != "") {
            await $('.blur').css('background', `url(${optionData.options.wallpaper}) round`);
        }
    }, 10);
}

function ThemeClick(event) {
    setTimeout(async() => {
        var themeCookie = optionData.themeCookie;
        if ($(this).attr('theme') == '') {
            console.log(`[ThemeClick] themedata`);
            if ($(this).children('.cmn-toggle').attr('checked') != undefined) {
                $(this).children('.cmn-toggle').attr('data-check', 'false');
                $(this).children('.cmn-toggle').removeAttr('checked');
                $(this).children('.cmn-toggle').removeAttr('active');
                themeCookie[$(this).children('.cmn-toggle').attr('id')] = false;
            } else {
                $(this).children('.cmn-toggle').attr('data-check', 'true');
                $(this).children('.cmn-toggle').attr('checked', '');
                $(this).children('.cmn-toggle').attr('active', '');
                themeCookie[$(this).children('.cmn-toggle').attr('id')] = true;
            }
            await optionData.update({ "themeCookie": themeCookie });
        }

        checkTheme();
    }, 10);
}

function refreshtheme() {
    console.log(`[refreshtheme] Atualizando estilo do Infinityapp`);
    themewallpaper();
    themeUpdate();
    setTimeout(() => {
        $('#theme-list').children().each((i, t) => {
            if (!$(t).hasClass('drag-drop-runs')) {
                $(t).remove();
            }
        });
        $('#wallpaper-list').children().each((i, t) => {
            if (!$(t).hasClass('drag-drop-runs')) {
                $(t).remove();
            }
        });

        themes.forEach((theme) => {
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
                        <div class="cmn-toggle cmn-toggle-round" data-theme-name="${theme.name}" data-author-name="${theme.author}" data-check="false" id="${theme.ID}"></div>
                        <label for="${theme.ID}"></label>
                    </div>
                </div>
                <div class="lost-tab-bottom">
                    <span class="tab-description">${theme.description}</span>
                </div>
            </div>
            `);

            if (optionData.themeCookie[theme.ID] == true) {
                $(`#${theme.ID}`).attr('data-check', 'true');
                $(`#${theme.ID}`).attr('checked', '');
                $(`#${theme.ID}`).attr('active', '');
            } else if (optionData.themeCookie[theme.ID] == false) {
                $(`#${theme.ID}`).attr('data-check', 'false');
                $(`#${theme.ID}`).removeAttr('checked');
                $(`#${theme.ID}`).removeAttr('active');
            } else {
                console.log(`[refreshtheme] Ops! Algo deu errado.`);
            }
        });

        if ($('.switch').attr('theme') != undefined) {
            $('.switch').click(ThemeClick);
        }

        datawallpaper.forEach(wallpaper => {
            let classNames = "contain-wallpaper animation-default";
            if (optionData.options.wallpaper == `base/wallpaper/${wallpaper}`) {
                classNames += " bg-active";
            }
            $('#wallpaper-list').append(`
            <div class="${classNames}">
                <img src="base/wallpaper/${wallpaper}"></img>
            </div>
            `);
        });

        setTimeout(() => {
            $('#wallpaper-list .drag-drop-runs #text-wallpaper').text(`${$('#wallpaper-list').children().length - 1} wallpaper disponivel(Arraste e solte wallpaper aqui, para serem adicionados)`);
            $('#theme-list .drag-drop-runs #text-theme').text(`${$('#theme-list').children().length - 1} tema disponivel(Arraste e solte temas aqui, para serem adicionados)`);
            $('.contain-wallpaper').click(wallpaperclick);
        }, 150);
    }, 150);
}

async function wallpaperclick(event) {
    console.log(`[wallpaperclick] Atualizando wallpaper`);
    $('.blur').css('background', `url(${$(this).children().attr('src')}) round`);
    await optionData.update({ "options.wallpaper": $(this).children().attr('src') });
    setTimeout(async() => {
        await refreshDB();
        refreshtheme();
    }, 100);
}