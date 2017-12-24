var File;
var theme;
var eventEmitter;

try {
    File = require(path.resolve(process.cwd(), './File.js'));
    theme = require(path.resolve(process.cwd(), './theme.js'));
    eventEmitter = require(path.resolve(process.cwd(), './events.js')).eventEmitter;
} catch (err) {
    File = require(path.resolve(process.cwd(), './resources/app/File.js'));
    theme = require(path.resolve(process.cwd(), './resources/app/theme.js'));
    eventEmitter = require(path.resolve(process.cwd(), './resources/app/events.js')).eventEmitter;
}

$('.option-contents').click(function() {
    $('.option-contents').removeClass('selected-item');
    switch ($(this).attr('type')) {
        case 'geral':
            $('#option-right-sidebar').children().css('display', 'none');
            $('#general-box').css('display', 'block');
            $(this).addClass('selected-item');
            break;
        case 'temas':
            $('#option-right-sidebar').children().css('display', 'none');
            $('#theme-box').css('display', 'block');
            $(this).addClass('selected-item');
            break;
        default:
            break;
    }
})

//options in-app
$('.switch').click(function() {
    setTimeout(() => {
        File.ReadFile('options.json', db => {
            var data = JSON.parse(db);
            var options = data.options;
            var themeCookie = data.themeCookie;
            var themeCheck = false;

            if ($(this).attr('theme') == '') {
                themeCookie.forEach(themedata => {
                    themes.themes.forEach(themes => {
                        var name = themes.name;
                        var author = themes.author;
                        themeCheck = true;

                        if (themedata.hasOwnProperty(name)) {
                            if (name == $(this).children('div').attr('data-theme-name')) {
                                themedata[name] = true;
                            } else if (name != $(this).children('div').attr('data-theme-name')) {
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

            // AnimationRun
            if ($(this).children('#mr-check-1').attr('checked')) {
                options.AnimationRun = true;
                $('.animation-default').addClass('animation-off');
                $('.animation-default').removeClass('animation-default');
            } else {
                options.AnimationRun = false;
                $('.animation-off').addClass('animation-default');
                $('.animation-off').removeClass('animation-off');
            }

            File.SaveFile('options.json', JSON.stringify(data));
        });
    }, 1);
});

// onLoad app
File.ReadFile('options.json', db => {
    var data = JSON.parse(db);
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
});