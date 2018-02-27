var File;
var theme;
var eventEmitter;
var path = require('path');

try {
    File = require(path.resolve(process.cwd(), './lib/File.js'));
    theme = require(path.resolve(process.cwd(), './lib/theme.js'));
    eventEmitter = require(path.resolve(process.cwd(), './lib/events.js')).eventEmitter;
} catch (err) {
    File = require(path.resolve(process.cwd(), './resources/app.asar/lib/File.js'));
    theme = require(path.resolve(process.cwd(), './resources/app.asar/lib/theme.js'));
    eventEmitter = require(path.resolve(process.cwd(), './resources/app.asar/lib/events.js')).eventEmitter;
}

function OptionContentsClick() {
    $('.option-contents').removeClass('selected-item');
    switch ($(this).attr('type')) {
        case 'geral':
            $('#option-right-sidebar').children().children().remove();
            $('#option-right-sidebar').children().css('display', 'none');
            $('#general-box').css('display', 'block');
            $(this).addClass('selected-item');
            $('#general-box').append(`
            <div class="mr-check">
                <div class="mr-text">
                    <div class="mr-text-title">
                        <span>Desativar animações</span>
                        <div class="switch">
                            <div class="cmn-toggle cmn-toggle-round" data-internal-name="AnimationRun" data-check="false" id="mr-check-1"></div>
                            <label for="mr-check-1"></label>
                        </div>
                    </div>
                    <div class="mr-text-description">
                        <span>Animações afeta o desempenho do aplicativo, recomanda-se desativa-las se seu desempenho estiver comprometido.</span>
                    </div>
                </div>
            </div>
            `);
            eventEmitter.emit('AnimationRunClick');
            break;
        case 'temas':
            $('#option-right-sidebar').children().children().remove();
            $('#option-right-sidebar').children().css('display', 'none');
            $('#theme-box').css('display', 'block');
            $('#theme-box').append(`
            <div>
                <div>
                    <div id="theme-reload-button" class="button-default">Reload</div>
                </div>
                <span style="font-weight: 700; color: #fff;">Themes</span>
                <div id="theme-list"></div>
                <span style="font-weight: 700; color: #fff;">Wallpaper</span>
                <div id="wallpaper-list" class="flexboxi"></div>
            </div>
            `);
            $('#theme-box').css('-webkit-clip-path', '200% at 50% 50%');
            $('#theme-box').css('clip-path', '200% at 50% 50%');
            $('#theme-reload-button').click(() => {
                // theme.themewallpaper();
                eventEmitter.emit('refreshtheme');
                eventEmitter.emit('checkTheme');
                eventEmitter.emit('ThemeClick');
            });
            $(this).addClass('selected-item');
            eventEmitter.emit('refreshtheme');
            eventEmitter.emit('checkTheme');
            eventEmitter.emit('ThemeClick');
            break;
        default:
            break;
    }
}

eventEmitter.on('OptionContentsClick', () => {
    $('.option-contents').click(OptionContentsClick);
});

//options in-app
function AnimationRunClick(event) {
    setTimeout(() => {
        File.ReadFile('options.json', db => {
            var data = db;
            var options = data.options;

            console.log(`[options] AnimationRun`);
            // AnimationRun
            if ($(this).children('#mr-check-1').attr('data-internal-name') == "AnimationRun") {
                if (!$(this).children('#mr-check-1').attr('checked')) {
                    // Checked
                    $(this).children('.cmn-toggle').attr('data-check', 'true');
                    $(this).children('.cmn-toggle').attr('checked', '');
                    $(this).children('.cmn-toggle').attr('active', '');

                    // Ação
                    options.AnimationRun = true;
                    $('.animation-default').addClass('animation-off');
                    $('.animation-default').removeClass('animation-default');
                } else {
                    // Checked
                    $(this).children('.cmn-toggle').attr('data-check', 'false');
                    $(this).children('.cmn-toggle').removeAttr('checked');
                    $(this).children('.cmn-toggle').removeAttr('active');

                    // Ação
                    options.AnimationRun = false;
                    $('.animation-off').addClass('animation-default');
                    $('.animation-off').removeClass('animation-off');
                }
            }

            File.SaveFile('options.json', JSON.stringify(data));
            data = null;
        });
    }, 1);
}

function ThemeClick(event) {
    setTimeout(() => {
        File.ReadFile('options.json', db => {
            var data = db;
            var options = data.options;
            var themeCookie = data.themeCookie;

            if ($(this).attr('theme') == '') {
                console.log(`[options] themedata`);
                themeCookie.forEach(themedata => {
                    themes.themes.forEach(themes => {
                        var name = themes.name;
                        var author = themes.author;

                        if ($(this).children('.cmn-toggle').attr('checked') != undefined) {
                            $(this).children('.cmn-toggle').attr('data-check', 'false');
                            $(this).children('.cmn-toggle').removeAttr('checked');
                            $(this).children('.cmn-toggle').removeAttr('active');
                            themedata[name] = false;
                        } else {
                            $(this).children('.cmn-toggle').attr('data-check', 'true');
                            $(this).children('.cmn-toggle').attr('checked', '');
                            $(this).children('.cmn-toggle').attr('active', '');
                            themedata[name] = true;
                        }

                        eventEmitter.emit('checkTheme');
                    });
                });
            }

            data.themeCookie = themeCookie;
            File.SaveFile('options.json', JSON.stringify(data));
            data = null;
        });
    }, 1);
}

eventEmitter.on('AnimationRunClick', () => {
    if ($('.cmn-toggle').attr('data-internal-name') == 'AnimationRun') {
        $('.cmn-toggle').parent().click(AnimationRunClick);
        eventEmitter.emit('onStartupApp');
    }
});

eventEmitter.on('ThemeClick', () => {
    if ($('.switch').attr('theme') == '') {
        $('.switch').click(ThemeClick);
    }
});

function onStartupApp(event) {
    // onLoad app
    File.ReadFile('options.json', db => {
        var data = db;
        var options = data.options;

        // AnimationRun
        if (options.AnimationRun == true) {
            // Checked
            $('.switch').children('#mr-check-1').attr('data-check', 'true');
            $('.switch').children('#mr-check-1').attr('checked', '');
            $('.switch').children('#mr-check-1').attr('active', '');

            // Ação
            $('.animation-default').addClass('animation-off');
            $('.animation-default').removeClass('animation-default');
        } else {
            // Checked
            $('.switch').children('#mr-check-1').attr('data-check', 'false');
            $('.switch').children('#mr-check-1').removeAttr('checked');
            $('.switch').children('#mr-check-1').removeAttr('active');

            // Ação
            $('.animation-off').addClass('animation-default');
            $('.animation-off').removeClass('animation-off');
        }

        console.log(`[options] checked`);
        data = null;
    });
}

eventEmitter.on('onStartupApp', onStartupApp);
eventEmitter.emit('onStartupApp');