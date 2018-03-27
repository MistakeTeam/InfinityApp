'use strict';

var i = 0,
    timeOut = 0,
    LeftM, RightM = false;

var userAgent = navigator.userAgent.toLowerCase();
console.log(userAgent);

var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function(event) {
    currentMousePos.x = event.pageX;
    currentMousePos.y = event.pageY;
});

$(document).on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
    })
    .on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

$('.win-minimize')
    .click(function(e) {
        CurrentWindow.minimize();
    });
$('.win-maximize')
    .click(function(e) {
        if (CurrentWindow.isMaximized()) {
            CurrentWindow.restore();
        } else {
            CurrentWindow.maximize();
        }
    });
$('.win-close')
    .click(function(e) {
        CurrentWindow.isVisible() ? CurrentWindow.hide() : CurrentWindow.show();
        // app.quit();
    });

$('status-indicator')
    .mouseenter(function(e) {
        if ($(this).attr('islive') == '') {
            $(this).append(`<span style="white-space: nowrap;">Ao Vivo</span><div class="marquee"><span>Teste Teste Teste Teste Teste Teste Teste Teste</span></div>`);
        }
    })
    .mouseleave(function(e) {
        if ($(this).attr('islive') == '') {
            $(this).html('');
        }
    });

//Load statusbar
let statusbar_item = [{
    containment: 'statusbar-top',
    enable: true,
    type: 'notifications',
    title: 'Sem notificações',
    content: `<span><span class="fa fa-bell"></span></span>`
}, {
    containment: 'statusbar-top',
    enable: connection,
    type: 'connections',
    title: ['Conecte sua conta externa', 'Sem internet não vai funcionar'],
    content: `<span><span class="fa fa-sync-alt"></span></span>`
}, {
    containment: 'statusbar-bottom',
    enable: true,
    type: 'pip',
    content: `<span><span class="fa fa-tv"></span></span>`
}, {
    containment: 'statusbar-bottom',
    enable: true,
    type: 'appslist',
    content: `<span><span class="fa fa-list"></span></span>`
}];

$('.statusbar')
    .append(`
        <div style="height: 100%;" id="statusbar-top"></div>
        <div style="height: 100%;display: flex;flex-direction: column-reverse;" id="statusbar-bottom"></div>
        `);

statusbar_item.forEach((statusbar, index, array) => {
    let attr = ``;
    if (statusbar.enable) {
        attr += `class="statusbar-item statusbar-item-active"`;
    } else {
        attr += `class="statusbar-item"`;
    }
    attr += `status-type="${statusbar.type}"`;
    if (statusbar.title) {
        if (typeof statusbar.title === String) {
            attr += `title="${statusbar.title}"`;
        } else {
            if (statusbar.enable) {
                attr += `title="${statusbar.title[0]}"`;
            } else {
                attr += `title="${statusbar.title[1]}"`;
            }
        }
    }

    $(`.statusbar #${statusbar.containment}`)
        .append(`<div ${attr}>${statusbar.content}</div>`);
});

$('.statusbar-item')
    .click(function(e) {
        if ($(this).hasClass('statusbar-item-active')) {
            switch ($(this).attr('status-type')) {
                case 'notifications':
                    eventEmitter.emit('statusbar-item-notification');
                    break;
                case 'connections':
                    if ($('.central-connections').length != 0) {
                        $('.central-connections').css('left', 'calc(100% - 300px)');
                        $('.central-connections').css('opacity', '0');
                        $('.central-connections').css('z-index', '0');
                        setTimeout(() => {
                            $('.central-connections').remove();
                        }, 300);
                        return;
                    }
                    $('.downmost').append(`
                        <div class="central-connections animation-default" style="top: 49px; left: calc(100% - 300px); opacity: 0;">
                            <div class="topbar-connections">
                                <span>Conexões</span>
                            </div>
                            <div class="active-connections animation-default">
                                <div connections-type="twitch">
                                    <img src="img/icons/5fd1b5df1b3fd51bd35f1b3df1b.png"></img>
                                </div>
                            </div>
                            <div class="auth-connections"></div>
                        </div>
                        `);
                    setTimeout(() => {
                        $('.central-connections').css('left', 'calc(100% - 335px)');
                        $('.central-connections').css('opacity', '1');
                        $('.central-connections').css('z-index', '15');

                        $('.active-connections').children().each((i, e) => {
                            switch ($(e).attr('connections-type')) {
                                case 'twitch':
                                    $(e).click(function(e) {
                                        URLExternal('http://localhost:8000/auth/twitch/');
                                    });
                                    break;
                                default:
                                    break;
                            }
                        })
                    }, 10);
                    break;
                case 'pip':
                    if ($('.contain-resize').length == 0) {
                        $('.downmost').append(`<div class="contain-resize"></div>`);
                    }
                    if ($('.video-pip').length != 0) {
                        $('.video-pip').css('right', '-500px');
                        $('.video-pip').css('opacity', '0');
                        $('.video-pip').css('z-index', '0');
                        setTimeout(() => {
                            $('.video-pip').remove();
                        }, 300);
                        return;
                    }
                    $('.contain-resize').append(`
                        <div class="video-pip animation-default" style="right: -500px; bottom: 15px; opacity: 0;">
                            <div class="topbar-pip">
                                <span>PIP</span>
                                <div id="pip-check">
                                    <div id="pip-text">
                                        <div id="pip-text-title">
                                            <div class="switch">
                                                <div class="cmn-toggle cmn-toggle-round" data-internal-name="pip" data-check="false" id="pip-check-1"></div>
                                                <label for="pip-check-1"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="active-pip">
                                <div id="player-pip">
                                    <!--<video src="" style="min-width: 480px; min-height: 240px;"></video>-->
                                    <!--<audio src="" style="min-width: 480px; min-height: 240px;"></audio>-->
                                </div>
                                <div class="progressbar-pip">
                                    <div class="progress-pip animation-default"></div>
                                    <div id="current-progress-pip" class="animation-default" style="width: 0px; background-color: white;"></div>
                                </div>
                                <div class="control-pip">
                                    <div class="pip-controls-left">
                                        <div class="pip-time-display notranslate">
                                            <span id="pip-time-current">--:--</span>
                                            <span id="pip-time-separator"> / </span>
                                            <span id="pip-time-duration">--:--</span>
                                        </div>
                                    </div>
                                    <div class="pip-controls-middle">
                                        <a class="pip-previous-button pip-button">
                                            <span>
                                                <span class="fa fa-fast-backward"></span>
                                            </span>
                                        </a>
                                        <button class="pip-play-button pip-button">
                                            <span>
                                                <span class="fa fa-play"></span>
                                            </span>
                                        </button>
                                        <a class="pip-next-button pip-button">
                                            <span>
                                                <span class="fa fa-fast-forward"></span>
                                            </span>
                                        </a>
                                    </div>
                                    <div class="pip-controls-right">
                                        <span class="pip-mute-button" style="display: flex; position: relative;">
                                            <div class="pip-button">
                                                <span>
                                                    <span class="fa fa-volume-up"></span>
                                                </span>
                                            </div>
                                            <div class="pip-volume-panel animation-default">
                                                <div class="pip-volume-slider" style="width: 100%;">
                                                    <div class="pip-volume-slider-handle"></div>
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `);
                    setTimeout(() => {
                        $('.video-pip')
                            .css('right', '15px')
                            .css('opacity', '1')
                            .css('z-index', '15');

                        if (optionData.options.pip == true) {
                            $('#pip-check .switch').children('.cmn-toggle').attr('data-check', 'true');
                            $('#pip-check .switch').children('.cmn-toggle').attr('checked', '');
                            $('#pip-check .switch').children('.cmn-toggle').attr('active', '');
                        } else if (optionData.options.pip == false) {
                            $('#pip-check .switch').children('.cmn-toggle').attr('data-check', 'false');
                            $('#pip-check .switch').children('.cmn-toggle').removeAttr('checked');
                            $('#pip-check .switch').children('.cmn-toggle').removeAttr('active');
                        }

                        $('.switch').click((event) => {
                            setTimeout(async() => {
                                console.log(`[options] pip`);
                                // pip
                                if ($(event.currentTarget).children('.cmn-toggle').attr('data-internal-name') == "pip") {
                                    if (!$(event.currentTarget).children('.cmn-toggle').attr('checked')) {
                                        // Checked
                                        $(event.currentTarget).children('.cmn-toggle').attr('data-check', 'true');
                                        $(event.currentTarget).children('.cmn-toggle').attr('checked', '');
                                        $(event.currentTarget).children('.cmn-toggle').attr('active', '');

                                        // Ação
                                        await optionData.update({ "options.pip": true });
                                    } else {
                                        // Checked
                                        $(event.currentTarget).children('.cmn-toggle').attr('data-check', 'false');
                                        $(event.currentTarget).children('.cmn-toggle').removeAttr('checked');
                                        $(event.currentTarget).children('.cmn-toggle').removeAttr('active');

                                        // Ação
                                        await optionData.update({ "options.pip": false });
                                    }
                                }

                                await refreshDB();
                            }, 1);
                        })
                    }, 10);
                    break;
                case 'appslist':
                    let apps = [];

                    function normalFunc() {
                        openApp();
                        $('.util-app').contents().filter('.country-gp-dnn').contents().css('visibility', 'hidden');
                        $('.central-apps')
                            .css('opacity', '0')
                            .css('z-index', '0');
                        setTimeout(() => {
                            $('.central-apps').remove();
                        }, 410);
                        setTimeout(() => {
                            $(`#${$(this).attr('app-id')}`).css('visibility', 'visible');
                            $('.util-app').contents().filter('.loading-init').remove();
                        }, 1300);
                    }

                    if ($('.country-gp-dnn').length != 0) {
                        $('.country-gp-dnn').children().each((index, element) => {
                            switch ($(element).attr('id')) {
                                case 'util-game':
                                    apps.push({
                                        name: lang.item_menu_games_name,
                                        id: $(element).attr('id')
                                    });
                                    break;
                                case 'util-options':
                                    apps.push({
                                        name: lang.item_menu_options_name,
                                        id: $(element).attr('id')
                                    });
                                    break;
                                case 'util-player':
                                    apps.push({
                                        name: lang.item_menu_player_name,
                                        id: $(element).attr('id')
                                    });
                                    break;
                                case 'util-browser':
                                    apps.push({
                                        name: 'Browser',
                                        id: $(element).attr('id')
                                    });
                                    break;
                                case 'util-TextEditor':
                                    apps.push({
                                        name: lang.item_menu_Text_Editor,
                                        id: $(element).attr('id')
                                    });
                                    break;
                                case 'util-twitch':
                                    apps.push({
                                        name: lang.item_menu_twitch_name,
                                        id: $(element).attr('id')
                                    });
                                    break;
                                default:
                                    break;
                            }
                        });
                    }

                    if ($('.central-apps').length != 0) {
                        $('.central-apps').css('opacity', '0');
                        $('.central-apps').css('z-index', '0');
                        setTimeout(() => {
                            $('.central-apps').remove();
                        }, 410);
                        return;
                    }

                    if (apps.length > 0) {
                        $('.downmost').append(`
                            <div class="central-apps animation-default" style="bottom: 0; right: 35px; opacity: 0; z-index: 0;">
                                <div class="active-apps animation-default"></div>
                            </div>
                            `);

                        $('.central-apps')
                            .css('opacity', '1')
                            .css('z-index', '15');

                        apps.forEach((value, index, array) => {
                            $('.central-apps .active-apps').append(`
                                <div id="app-${value.id}" app-id="${value.id}">
                                    <span>${value.name}</span>
                                    <div id="close-${value.id}">
                                        <span class="fa fa-window-close"></span>
                                    </div>
                                </div>
                                `);
                            $(`#app-${value.id}`).click(normalFunc);
                            $(`#close-${value.id}`).click(() => {
                                $(`#${value.id}`).remove();
                                $(`#app-${value.id}`).remove();
                                apps.splice(index, 1);
                                if ($('.central-apps .active-apps').children().length <= 0) {
                                    $('.central-apps').remove();
                                }
                                if ($('.country-gp-dnn').children().length <= 0) {
                                    $('.country-gp-dnn').remove();
                                    IAPI.init({
                                        state: 'Menu',
                                        active: false
                                    });
                                    CurrentWindow.setTitle(`Menu - Infinityapp`);
                                    if ($('#util-player').length != 0 || $('#player-script').length != 0) {
                                        if (videoNode.played.length != 0) {
                                            if (videoNode.played.start(0) == 0 && !videoNode.paused) {
                                                videoNode.pause();
                                                BPlay.attr('d', 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z');
                                            }
                                        }
                                    }
                                    $('.util-app').css('transform', 'scale(1.1, 1.1)');
                                    $('.util-app').css('opacity', '0');
                                    $('.util-app').css('z-index', '-1');
                                    $('.util-app').contents().filter('.loading-init').remove();
                                    $('.back-o4f98s').css('opacity', '0');
                                    $('.back-o4f98s').css('pointer-events', 'none');
                                    $('.back-o4f98s').css('display', 'block');
                                    $('.menu-itens').css('transform', 'scale(1, 1)');
                                    $('.menu-itens').css('opacity', '1');
                                    $('.menu-itens').css('z-index', '6');
                                    if ($('#util-player').length == 0 || ($('#player-script').length != 0 && $('#player-script').attr('pip') == undefined)) {
                                        $('#player-script').remove();
                                    }
                                }
                            });
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    });

function backToMenu(event) {
    IAPI.init({
        state: 'Menu',
        active: false
    });
    CurrentWindow.setTitle(`Menu - Infinityapp`);
    if ($('#util-player').length != 0 || $('#player-script').length != 0) {
        if (videoNode.played.length != 0) {
            if (videoNode.played.start(0) == 0 && !videoNode.paused) {
                videoNode.pause();
                BPlay.attr('d', 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z');
            }
        }
    }
    $('.util-app').css('transform', 'scale(1.1, 1.1)');
    $('.util-app').css('opacity', '0');
    $('.util-app').css('z-index', '-1');
    $('.util-app').contents().filter('.loading-init').remove();
    $('.back-o4f98s').css('opacity', '0');
    $('.back-o4f98s').css('pointer-events', 'none');
    $('.back-o4f98s').css('display', 'block');
    $('.menu-itens').css('transform', 'scale(1, 1)');
    $('.menu-itens').css('opacity', '1');
    $('.menu-itens').css('z-index', '6');
    if ($('#player-script').length != 0 && $('#player-script').attr('pip') == undefined) {
        $('#player-script').remove();
    }
    setTimeout(() => {
        $('.util-app').contents().filter('.country-gp-dnn').contents().css('visibility', 'hidden');
        $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#util-soon').remove();
    }, 500);
}

$(document).keydown(function(event) {
    if (event.which == 27) {
        backToMenu(event);
    }
});

$('.back-o4f98s').click(backToMenu);

function openApp() {
    //bug fix
    if ($('#right-mouse-options').length != 0) {
        $('#right-mouse-options').remove();
    }

    // transition-function
    $('.util-app').css('transform', 'scale(1, 1)');
    $('.util-app').css('opacity', '1');
    $('.util-app').css('z-index', '10');
    $('.menu-itens').css('transform', 'scale(0.9, 0.9)');
    $('.menu-itens').css('opacity', '0');
    $('.menu-itens').css('z-index', '0');
    $('.back-o4f98s').css('pointer-events', 'auto');
    $('.back-o4f98s').css('opacity', '1');

    // loading
    $('.util-app').append(`
    <div class="loading-init">
        <div class="typing-3eiiL_">
            <span class="ellipsis--nKTEd">
                <span class="spinner-inner spinner-pulsing-ellipsis">
                    <span class="spinner-item"></span>
                    <span class="spinner-item"></span>
                    <span class="spinner-item"></span>
                </span>
            </span>
        </div>
    </div>
    `);
}

$('.itens-button')
    .on('mousedown', function(event) {
        switch (event.which) {
            case 1:
                LeftM = true;
                $(this).addClass('active');
                timeOut = setInterval(() => {
                    i++;
                }, 1000);
                console.log('Left Mouse button pressed.');
                break;
            case 3:
                RightM = true;
                console.log('Right Mouse button pressed.');
                break;
            default:
                console.log('You have a strange Mouse!');
        }
    })
    .on('mouseup', function(event) {
        if (LeftM && !RightM) {
            if (i > 5) {
                console.log(`Botão sendo presionado`);
            } else if (i < 5) {
                console.log(`Botão presionado`);
            }
        } else if (!LeftM && RightM) {
            if ($('#right-mouse-options').length == 0) {
                $('.downmost').append(`<div id="right-mouse-options" style="left: auto; right: auto; bottom: auto; top: auto;"></div>`);
            } else if ($('#right-mouse-options').length > 0) {
                if ($('#right-mouse-options').children().length > 0) {
                    $('#right-mouse-options').children().remove();
                }
            }

            switch ($(this).attr('data-internal-name')) {
                case 'util-game':
                    let lite = [{
                        id: "module-rmouse-play-easy",
                        text: "Jogos rapidos",
                        generator: function() {
                            eventEmitter.emit('extra_game');
                            setTimeout(() => {
                                $('.play_easy').css('opacity', '1');
                                $('.play_easy').css('display', 'flex');
                                $('#right-mouse-options').remove();
                            }, 10);
                        }
                    }];
                    touchCloseMenus();
                    lite.forEach((value, index, array) => {
                        $('#right-mouse-options').append(`<div class="options-item" id="${value.id}"><span>${value.text}</span></div>`);
                        $(`#${value.id}`).click(value.generator);
                    });
                    break;
                default:
                    break;
            }

            if ($('#right-mouse-options').children().length > 0) {
                console.log(`${(event.clientX + $('#right-mouse-options').outerWidth(true))} > ${($('#document-body').width() - 35)}`);
                console.log(`${(event.clientY + $('#right-mouse-options').outerHeight(true))} > ${$('#document-body').height()}`);
                if ((event.clientX + $('#right-mouse-options').outerWidth(true)) > ($('#document-body').width() - 35)) {
                    let result = 35;
                    $('#right-mouse-options').css('left', `auto`);
                    $('#right-mouse-options').css('right', `${result}px`);
                } else {
                    $('#right-mouse-options').css('left', `${event.clientX}px`);
                    $('#right-mouse-options').css('right', `auto`);
                }
                if ((event.clientY + $('#right-mouse-options').outerHeight(true)) > $('#document-body').height()) {
                    let result = 0;
                    $('#right-mouse-options').css('bottom', `${result}px`);
                    $('#right-mouse-options').css('top', `auto`);
                } else {
                    $('#right-mouse-options').css('bottom', `auto`);
                    $('#right-mouse-options').css('top', `${event.clientY}px`);
                }
            } else if ($('#right-mouse-options').children().length <= 0) {
                $('#right-mouse-options').remove();
            }
        }
        LeftM = false;
        RightM = false;
        $(this).removeClass('active');
        i = 0;
        clearInterval(timeOut);
        return;
    })
    .on('dblclick', function(event) {
        if ($('.country-gp-dnn').length == 0) {
            $('.util-app').append(`<div class="country-gp-dnn"></div>`);
        }

        openApp();

        setTimeout(() => {
            switch ($(this).attr('data-internal-name')) {
                case 'util-options':
                    IAPI.init({
                        state: 'Opções',
                        active: false
                    });
                    if ($('#util-options').length == 0) {
                        $('.country-gp-dnn').append(`
                                <div style="visibility: hidden;" id="util-options">
                                    <div class="app-configuration">
                                        <div id="option-left-sidebar">
                                            <div class="option-contents selected-item" type="geral">
                                                <span><span class="fa fa-long-arrow-alt-right"></span> Geral</span>
                                            </div>
                                            <div class="option-contents selected-item" type="discord">
                                                <span><span class="fab fa-discord"></span> Discord</span>
                                            </div>
                                            <div class="option-contents selected-item" type="video">
                                                <span><span class="fa fa-video"></span> Audio & Video</span>
                                            </div>
                                            <div class="option-contents" type="temas">
                                                <span><span class="fa fa-paint-brush"></span> Temas</span>
                                            </div>
                                            <div class="option-contents selected-item" type="translate">
                                                <span><span class="fa fa-language"></span> Tradução</span>
                                            </div>
                                            <div class="separador" style="width: 90%; height: 1px; margin: auto;"></div>
                                            <div class="socialLinks-ry5263">
                                                <a class="link-13ZMYi" rel="author" title="Twitter" onclick="URLExternal(&quot;https://twitter.com/infinityapp1&quot;)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16">
                                                        <g fill="none" fill-rule="evenodd">
                                                            <path fill="#adadad" d="M1,14.1538462 L1.95,14.1538462 C3.73125,14.1538462 5.5125,13.5384615 6.81875,12.4307692 C5.15625,12.4307692 3.73125,11.2 3.1375,9.6 C3.375,9.6 3.6125,9.72307692 3.85,9.72307692 C4.20625,9.72307692 4.5625,9.72307692 4.91875,9.6 C3.1375,9.23076923 1.7125,7.63076923 1.7125,5.66153846 C2.1875,5.90769231 2.78125,6.15384615 3.49375,6.15384615 C2.425,5.41538462 1.83125,4.18461538 1.83125,2.70769231 C1.83125,1.96923077 2.06875,1.23076923 2.30625,0.615384615 C4.20625,3.07692308 7.05625,4.67692308 10.38125,4.8 C10.2625,4.67692308 10.2625,4.30769231 10.2625,4.06153846 C10.2625,1.84615385 12.04375,0 14.18125,0 C15.25,0 16.31875,0.492307692 17.03125,1.23076923 C17.8625,1.10769231 18.8125,0.738461538 19.525,0.246153846 C19.2875,1.23076923 18.575,1.96923077 17.8625,2.46153846 C18.575,2.46153846 19.2875,2.21538462 20,1.84615385 C19.525,2.70769231 18.8125,3.32307692 18.1,3.93846154 L18.1,4.43076923 C18.1,9.84615385 14.18125,16 6.9375,16 C4.68125,16 2.6625,15.3846154 1,14.1538462 Z"></path>
                                                            <rect width="20" height="16"></rect>
                                                        </g>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="separador" style="width: 1px; height: 100%;"></div>
                                        <div id="option-right-sidebar">
                                            <div style="display: block; padding: 0 10px;" id="general-box"></div>
                                            <div style="display: block; padding: 0 10px;" id="discord-box"></div>
                                            <div style="display: none; -webkit-clip-path: circle(200% at 50% 50%); clip-path: circle(200% at 50% 50%); padding: 0 10px;" id="theme-box" class="animation-default"></div>
                                            <div style="display: block; padding: 0 10px;" id="soon-box"></div>
                                        </div>
                                    </div>
                                </div>
                                `);
                        CurrentWindow.setTitle(`Opções - Idle`);
                        $('.option-contents').click(OptionContentsClick);
                        $('#general-box').append(`
                                <div class="loading-init">
                                    <div class="typing-3eiiL_">
                                        <span class="ellipsis--nKTEd">
                                            <span class="spinner-inner spinner-pulsing-ellipsis">
                                                <span class="spinner-item"></span>
                                                <span class="spinner-item"></span>
                                                <span class="spinner-item"></span>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div id="config-general-box" style="display: none;">
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
                                </div>
                                `);
                        eventEmitter.emit('AnimationRunClick');
                        $('.option-contents').removeClass('selected-item');
                        $('#option-right-sidebar').children().css('display', 'none');
                        $('#general-box').css('display', 'block');
                        $('.option-contents').each((index, op) => {
                            if ($(op).attr('type') == 'geral') {
                                $(op).addClass('selected-item');
                            }
                        });
                        setTimeout(() => {
                            $('#config-general-box').css('display', 'block');
                            $('#general-box>.loading-init').remove();
                        }, 1500);
                    }
                    break;
                case 'util-game':
                    IAPI.init({
                        state: 'Games',
                        active: false
                    });
                    if ($('#util-game').length == 0) {
                        $('.country-gp-dnn').append(`
                            <div style="visibility: hidden;" id="util-game">
                                <div class="games-H5wY75">
                                    <div class="game-add-F58dY4">
                                        <div class="game-add-button"></div>
                                        <div class="game-add-footer animation-default">
                                            <span class="footer-title">Add Game</span>
                                            <span class="footer-descripition animation-default" style="opacity: 0; display: none;">Adicione games a sua lista.</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="expo-game-fT46of">
                                    <div class="is-overlay animation-default" id="over-gi592n" style="display: none; opacity: 0;"></div>
                                </div>
                            </div>
                            `);
                        eventEmitter.emit('Game_Module_Open');
                        CurrentWindow.setTitle(`Games - Idle`);
                        eventEmitter.emit('open-module-games');
                    }
                    break;
                case 'util-player':
                    IAPI.init({
                        state: 'Player',
                        active: false
                    });
                    if ($('#util-player').length == 0) {
                        $('.country-gp-dnn').append(`
                            <div style="visibility: hidden;" id="util-player">
                                <div>
                                    <div class="player-T1ow86">
                                        <div class="is-overlay animation-default" id="over-Rtj493" style="display: none; opacity: 0.85;"></div>
                                        <div class="player-playlist" style="width: 0px; z-index: -1;">
                                            <div class="infinity-dock-resize-handle resize-left"></div>
                                            <div class="playlist-contains">
                                                <div class="buttons-actions-playlist">
                                                    <div style="width: 100%; margin-left: 2px;">
                                                        <div class="add-playlist">
                                                            <input type="file" id="pb-input" accept="video/* , audio/*" multiple="" maxLength="5" style="display: none;">
                                                            <label for="pb-input">
                                                                <span class="fa fa-list-alt"></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div style="margin: auto 5px;">
                                                        <span id="hora-total">--:--</span>
                                                    </div>
                                                </div>
                                                <div class="list-itens-playlist"></div>
                                            </div>
                                            <div class="infinity-dock-cursor-overlay resize-left"></div>
                                        </div>
                                        <div class="player-video">
                                            <div class="back-video"></div>
                                            <video id="getduration" src="" autoplay="" style="display:none;"></video>
                                            <video src="" id="pb-video" onclick="play_video()" autoplay=""></video>
                                        </div>
                                        <div class="player-controls-botton">
                                            <div class="player-progress-bar">
                                                <div class="progress-bar animation-default"></div>
                                                <div id="progress-loader" class="animation-default"></div>
                                            </div>
                                            <div class="player-controls">
                                                <div class="controls-left">
                                                    <div class="ply-time-display notranslate">
                                                        <span id="ply-time-current">--:--</span>
                                                        <span id="ply-time-separator"> / </span>
                                                        <span id="ply-time-duration">--:--</span>
                                                    </div>
                                                </div>
                                                <div class="controls-middle">
                                                    <a class="ply-previous-button ply-button animation-default">
                                                        <span>
                                                            <span class="fa fa-fast-backward"></span>
                                                        </span>
                                                    </a>
                                                    <button class="ply-play-button ply-button animation-default" aria-label="Reproduzir" onclick="play_video()">
                                                        <span>
                                                            <span class="fa fa-play"></span>
                                                        </span>
                                                    </button>
                                                    <a class="ply-next-button ply-button animation-default">
                                                        <span>
                                                            <span class="fa fa-fast-forward"></span>
                                                        </span>
                                                    </a>
                                                </div>
                                                <div class="controls-right">
                                                    <div class="ply-button" id="playlist-open-y40so9">
                                                        <span>
                                                            <span class="fa fa-list-alt"></span>
                                                        </span>
                                                    </div>
                                                    <span style="display: flex; position: relative;">
                                                        <div class="ply-button ply-mute-button">
                                                            <span>
                                                                <span class="fa fa-volume-up"></span>
                                                            </span>
                                                        </div>
                                                        <div class="ply-volume-panel animation-default" role="slider" aria-valuemin="0" aria-valuemax="100" tabindex="0" aria-valuenow="100" aria-valuetext="100% volume">
                                                            <div class="ply-volume-slider" style="width: 100%;">
                                                                <div class="ply-volume-slider-handle"></div>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`);
                        CurrentWindow.setTitle(`Player - Idle`);
                        let attrPIP = '';
                        if (optionData.options.pip == true) {
                            attrPIP = 'pip';
                        }
                        $('#document-body').append(`<script id="player-script" src="/js/player.js" ${attrPIP}></script>`);
                    }
                    break;
                case 'util-browser':
                    if ($('#util-browser').length == 0) {
                        $('.country-gp-dnn').append(`
                            <div style="visibility: hidden;" id="util-browser">
                                <div id="browser-controls">
                                    <div id="browser-tabs">
                                        <div class="tabs-contain tab-select">
                                            <span>Nova Guia</span>
                                            <div class="close-tab"></div>
                                        </div>
                                    </div>
                                    <div id="browser-controls-buttons">
                                        <input id="page-url"></input>
                                    </div>
                                </div>
                                <div id="browser-page-web">
                                    <webview id="page-web" src="http://www.google.com/" style="height: 100%;" useragent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko"></webview>
                                </div>
                            </div>
                            `);
                        $('#document-body').append(`<script id="browser-script" src="/js/browser.js"></script>`);
                    }
                    break;
                case 'util-TextEditor':
                    IAPI.init({
                        state: 'Editor de Texto',
                        active: false
                    });
                    if ($('#util-TextEditor').length == 0) {
                        $('.country-gp-dnn').append(`
                            <div style="visibility: hidden;" id="util-TextEditor">
                                <div id="TextEditor-global">
                                    <div class="TextEditor-editor">
                                        <div class="TextEditor-line" id="TextEditor-font">
                                            <div class="TextEditor-line-count"></div>
                                            <div class="TextEditor-line-view" style="width: 100%;"></div>
                                        </div>
                                        <div id="overflow-TextEditor"></div>
                                        <textarea id="TextEditor-inputarea" wrap="off" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" aria-label="O editor não está acessível neste momento." role="textbox" aria-multiline="true" aria-haspopup="false" aria-autocomplete="both" style="font-size: 1px; line-height: 19px; width: 1px; height: 1px;"></textarea>
                                    </div>
                                </div>
                            </div>
                            `);
                        startTextEditor();
                    }
                    break;
                case 'util-twitch':
                    if (connection) {
                        IAPI.init({
                            state: 'Twitch',
                            active: false
                        });
                        if ($('#util-twitch').length == 0) {
                            $('.country-gp-dnn').append(`
                                <div style="visibility: hidden;" id="util-twitch">
                                    <!-- Add a placeholder for the Twitch embed -->
                                    <div id="twitch-embed"></div>
                                    <div id="twitch-button-init" class="twitch-options">
                                        <div class="twitch-button-low animation-default">
                                            <img src="img/icons/5fd1b5df1b3fd51bd35f1b3df1b.png"></img>
                                        </div>
                                    </div>
                                    <!-- Create a Twitch.Embed object that will render within the "twitch-embed" root element. -->
                                    <script src="js/twitch.js"></script>
                                </div>
                                `);
                            CurrentWindow.setTitle(`Twitch - Idle`);
                        }
                    } else {
                        if ($('#util-soon').length == 0) {
                            $('.country-gp-dnn').append(`
                                <div style="visibility: hidden;" id="util-soon">
                                    <div class="soon-2tfY60">
                                        <span>Twitch não está disponivel no modo offline</span>
                                    </div>
                                </div>
                                `);
                        }
                        $('.back-o4f98s').css('opacity', '1');
                    }
                    break;
                default:
                    $('.country-gp-dnn').append(`
                            <div style="visibility: hidden;" id="util-soon">
                                <div class="soon-2tfY60">
                                    <span>Recurso indisponível</span>
                                </div>
                            </div>
                            `);
                    $('.back-o4f98s').css('opacity', '1');
                    break;
            }
        }, Math.random() * 1000);
        eventEmitter.emit('onStartupApp');
        setTimeout(() => {
            $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#util-soon').css('visibility', 'visible');
            $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#' + $(this).attr('data-internal-name')).css('visibility', 'visible');
            $('.util-app').contents().filter('.loading-init').remove();
        }, 1500);
        LeftM = false;
        RightM = false;
        $(this).removeClass('active');
        i = 0;
        clearInterval(timeOut);
        return;
    })
    .on('mouseleave', function() {
        LeftM = false;
        RightM = false;
        $(this).removeClass('active');
        i = 0;
        clearInterval(timeOut);
    })
    .on('mouseenter', function() {})
    .on('dragenter', function(event) {
        switch ($(this).attr('data-internal-name')) {
            case 'util-game':
                $(this).children('.drag-event').css('display', 'block');
                setTimeout(() => {
                    $(this).children('.drag-event').children('.uploadbox').css('background', 'rgba(0, 0, 0, 0.75)');
                }, 10);
                break;
            default:
                break;
        }
    })
    .on('dragleave', function(event) {
        switch ($(this).attr('data-internal-name')) {
            case 'util-game':
                $(this).children('.drag-event').css('display', 'none');
                $(this).children('.drag-event').children('.uploadbox').css('background', 'transparent');
                break;
            default:
                break;
        }
    })
    .on('drop', function(event) {
        switch ($(this).attr('data-internal-name')) {
            case 'util-game':
                $(this).children('.drag-event').css('display', 'none');
                $(this).children('.drag-event').children('.uploadbox').css('background', 'transparent');
                break;
            default:
                break;
        }
    })
    // .draggable({ grid: [120, 120], containment: "parent" })