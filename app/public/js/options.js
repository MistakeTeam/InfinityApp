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

$('.option-contents').click(function() {
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
            $(this).addClass('selected-item');
            eventEmitter.emit('refreshtheme');
            eventEmitter.emit('checkTheme');
            eventEmitter.emit('ThemeClick');
            break;
        default:
            break;
    }
})

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
            var themeCheck = false;

            if ($(this).attr('theme') == '') {
                console.log(`[options] themedata`);
                themeCookie.forEach(themedata => {
                    themes.themes.forEach(themes => {
                        var name = themes.name;
                        var author = themes.author;
                        themeCheck = true;

                        if (themedata.hasOwnProperty(name)) {
                            if (name == $(this).children('div').attr('data-theme-name')) {
                                $(this).children('.cmn-toggle').attr('data-check', 'true');
                                $(this).children('.cmn-toggle').attr('checked', '');
                                $(this).children('.cmn-toggle').attr('active', '');
                                themedata[name] = true;
                            } else if (name != $(this).children('div').attr('data-theme-name')) {
                                $(this).children('.cmn-toggle').attr('data-check', 'false');
                                $(this).children('.cmn-toggle').removeAttr('checked');
                                $(this).children('.cmn-toggle').removeAttr('active');
                                themedata[name] = false;
                            }
                        } else {}
                    });
                });
            }

            if (themeCheck) {
                eventEmitter.emit('checkTheme');
                themeCheck = false;
            }

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

eventEmitter.on('onStartupApp', onStartupApp);

function onStartupApp(params) {
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

eventEmitter.emit('onStartupApp');