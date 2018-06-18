'use strict';

var i = 0,
    timeOut = 0,
    LeftM = false,
    RightM = false;

Mousetrap().bind(['up u a up up'], () => {
    console.log("Plus Utra!");
});

var currentMousePos = { x: -1, y: -1 };
$(document)
    .mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    })
    .keydown(function(event) {
        if (event.which == 27) {
            backToMenu(event);
        }
    })
    .click(function(event) {
        ['right-mouse-options', 'play_easy', 'central-notifications'].forEach((v1, i1, a1) => {
            ['calendar-button-new', 'Editor-button-file'].forEach((v2, i2, a2) => {
                if ($(event.target).parents().filter(`#${v1}`).length != 0 || $(event.target).parents().filter(`.${v1}`).length != 0 || $(event.target).filter(`#${v1}`).length != 0 || $(event.target).filter(`.${v1}`).length != 0) {
                    return;
                }

                if ($(event.target).filter(`#${v1}`).length == 0 || $(event.target).filter(`.${v1}`).length == 0 || $(event.target).filter(`#${v2}`).length == 0 || $(event.target).filter(`.${v2}`).length == 0) {
                    if (($(`#${v1}`).length > 0 || $(`.${v1}`).length > 0) && CLOSE_MENU == true) {
                        $(`#${v1}`).remove();
                        $(`.${v1}`).remove();
                        CLOSE_MENU = false;
                    }
                }
            });
        });
    })
    .on('drop', function(e) {
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
                    setTimeout(() => {
                        eventEmitter.emit('statusbar-item-notification');
                    }, 10);
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
                                    <!--<video src="" autoplay style="min-width: 480px; min-height: 240px;"></video>-->
                                    <!--<audio src="" autoplay style="min-width: 480px; min-height: 240px;"></audio>-->
                                </div>
                                <div class="control-pip">
                                    <div class="progressbar-pip">
                                        <div class="progress-pip animation-default"></div>
                                        <div id="current-progress-pip" class="animation-default" style="width: 0px; background-color: white;"></div>
                                    </div>
                                    <div class="main-control">
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
                        });
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
                        switch ($(this).attr('app-id')) {
                            case 'util-calendar':
                                moreOpCalendar();
                                break;
                            default:
                                break;
                        }
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
                                case 'util-calendar':
                                    apps.push({
                                        name: lang.item_menu_calendar_name,
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
                                if ($(`#${value.id}`).css('visibility') == 'visible') {
                                    IAPI.init({
                                        state: 'Menu',
                                        active: false
                                    });
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
                                    $('.back-o4f98s').css('display', 'none');
                                    $('.menu-itens').css('transform', 'scale(1, 1)');
                                    $('.menu-itens').css('opacity', '1');
                                    $('.menu-itens').css('z-index', '6');
                                    if ($('#util-player').length == 0 || ($('#player-script').length != 0 && $('#player-script').attr('pip') == undefined)) {
                                        $('#player-script').remove();
                                    }
                                }
                                $(`#${value.id}`).remove();
                                $(`#app-${value.id}`).remove();
                                apps.splice(index, 1);
                                $('.titlebar-buttons').contents().filter('.app-button-style').remove();
                                if ($('.central-apps .active-apps').children().length <= 0) {
                                    $('.central-apps').remove();
                                }
                                if ($('.country-gp-dnn').children().length <= 0) {
                                    $('.country-gp-dnn').remove();
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
//statusbar

function backToMenu(event) {
    IAPI.init({
        state: 'Menu',
        active: false
    });
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
    setTimeout(() => {
        $('.back-o4f98s').css('display', 'none');
    }, 450);
    $('.menu-itens').css('transform', 'scale(1, 1)');
    $('.menu-itens').css('opacity', '1');
    $('.menu-itens').css('z-index', '6');
    if ($('#player-script').length != 0 && $('#player-script').attr('pip') == undefined) {
        $('#player-script').remove();
    }
    if (optionData.options.pip == true) {

    }
    $('.titlebar-buttons').contents().filter('.app-button-style').remove();
    setTimeout(() => {
        $('.util-app').contents().filter('.country-gp-dnn').contents().css('visibility', 'hidden');
        $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#util-soon').remove();
    }, 500);
}

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
    $('.back-o4f98s').css('display', 'block');
    setTimeout(() => {
        $('.back-o4f98s').css('opacity', '1');
    }, 10);

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

//Load Menu
let item_Menu = [{
    classnames: [],
    datainternalname: "util-game",
    attrs: ['play_easy'],
    icon: `<svg class="animation-default" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.837 56.837" style="enable-background:new 0 0 56.837 56.837;" xml:space="preserve"><path style="fill:#AFB6BB;" d="M43.598,15.837h-6.271H36.35c-1.826,2.707-4.921,4.488-8.432,4.488s-6.606-1.781-8.432-4.488h-0.976  H13.24c-2.939,0-5.321,2.382-5.321,5.321v30.358c0,2.939,2.382,5.321,5.321,5.321h30.358c2.939,0,5.321-2.382,5.321-5.321V21.158  C48.919,18.219,46.536,15.837,43.598,15.837z"></path><path style="fill:#E7ECED;" d="M27.919,20.326c-1.044,0-2.052-0.159-3-0.451V35c0,1.657,1.343,3,3,3s3-1.343,3-3V19.874  C29.97,20.167,28.963,20.326,27.919,20.326z"></path><circle style="fill:#DD352E;" cx="15.151" cy="49.07" r="2.767"></circle><path style="fill:none;stroke:#E7ECED;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" d="M36.919,52.837  c4.422,0,8-3.578,8-8"></path><path style="fill:#546A79;" d="M30.919,22.199V35c0,1.657-1.343,3-3,3s-3-1.343-3-3V22.199c-5.731,1.356-10,6.493-10,12.638  c0,7.18,5.82,13,13,13s13-5.82,13-13C40.919,28.692,36.649,23.555,30.919,22.199z"></path><path style="fill:#38454F;" d="M30.919,25.496V35c0,1.657-1.343,3-3,3s-3-1.343-3-3v-9.504C21.19,26.75,18.5,30.267,18.5,34.419  c0,5.202,4.217,9.419,9.419,9.419c5.202,0,9.419-4.217,9.419-9.419C37.337,30.267,34.648,26.75,30.919,25.496z"></path><circle style="fill:#DD352E;" cx="27.919" cy="10.163" r="10.163"></circle><path style="fill:#ED7161;" d="M21.919,10.837c-0.552,0-1-0.447-1-1c0-3.309,2.691-6,6-6c0.552,0,1,0.447,1,1s-0.448,1-1,1  c-2.206,0-4,1.794-4,4C22.919,10.39,22.471,10.837,21.919,10.837z"></path></svg>`,
    spannameID: "item_menu_games_name",
    htmlExtra: ``,
    styleIconExtra: ``,
    stylePrinc: ``
}, {
    classnames: [],
    datainternalname: "util-player",
    attrs: [],
    icon: `<svg class="animation-default" height="100%" version="1.1" viewBox="8 8 20 20" width="100%"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ply-id-28"></use><path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ply-id-28"></path></svg>`,
    spannameID: "item_menu_player_name",
    htmlExtra: ``,
    styleIconExtra: ``,
    stylePrinc: ``
}, {
    classnames: [],
    datainternalname: "util-twitch",
    attrs: [],
    icon: `<img class="animation-default" style="width: 100%;" src="img/icons/5fd1b5df1b3fd51bd35f1b3df1b.png">`,
    spannameID: "item_menu_twitch_name",
    htmlExtra: ``,
    styleIconExtra: `width: 40px;`,
    stylePrinc: ``
}, {
    classnames: [],
    datainternalname: "util-calendar",
    attrs: [],
    icon: `<span class="fa fa-calendar-alt"></span>`,
    spannameID: "item_menu_calendar_name",
    htmlExtra: ``,
    styleIconExtra: `font-size: 30px;`,
    stylePrinc: ``
}, {
    classnames: [],
    datainternalname: "util-TextEditor",
    attrs: [],
    icon: `<span class="fa fa-code"></span>`,
    spannameID: "item_menu_Text_Editor",
    htmlExtra: ``,
    styleIconExtra: `font-size: 30px;`,
    stylePrinc: ``
}, {
    classnames: [],
    datainternalname: "util-options",
    attrs: [],
    icon: `<svg class="colorSelectedText-3YhFC6 icon-3tVJnl animation-default" xmlns="http://www.w3.org/2000/svg" viewBox="1 1 16 16"><path d="M7.15546853,6.47630098e-17 L5.84453147,6.47630098e-17 C5.36185778,-6.47630098e-17 4.97057344,0.391750844 4.97057344,0.875 L4.97057344,1.9775 C4.20662236,2.21136254 3.50613953,2.61688993 2.92259845,3.163125 L1.96707099,2.61041667 C1.76621819,2.49425295 1.52747992,2.46279536 1.30344655,2.52297353 C1.07941319,2.58315171 0.88846383,2.73002878 0.77266168,2.93125 L0.117193154,4.06875 C0.00116776262,4.26984227 -0.0302523619,4.50886517 0.0298541504,4.73316564 C0.0899606628,4.9574661 0.236662834,5.14864312 0.437644433,5.26458333 L1.39171529,5.81583333 C1.21064614,6.59536289 1.21064614,7.40609544 1.39171529,8.185625 L0.437644433,8.736875 C0.236662834,8.85281521 0.0899606628,9.04399223 0.0298541504,9.2682927 C-0.0302523619,9.49259316 0.00116776262,9.73161606 0.117193154,9.93270833 L0.77266168,11.06875 C0.88846383,11.2699712 1.07941319,11.4168483 1.30344655,11.4770265 C1.52747992,11.5372046 1.76621819,11.5057471 1.96707099,11.3895833 L2.92259845,10.836875 C3.50613953,11.3831101 4.20662236,11.7886375 4.97057344,12.0225 L4.97057344,13.125 C4.97057344,13.6082492 5.36185778,14 5.84453147,14 L7.15546853,14 C7.63814222,14 8.02942656,13.6082492 8.02942656,13.125 L8.02942656,12.0225 C8.79337764,11.7886375 9.49386047,11.3831101 10.0774016,10.836875 L11.032929,11.3895833 C11.2337818,11.5057471 11.4725201,11.5372046 11.6965534,11.4770265 C11.9205868,11.4168483 12.1115362,11.2699712 12.2273383,11.06875 L12.8828068,9.93270833 C12.9988322,9.73161606 13.0302524,9.49259316 12.9701458,9.2682927 C12.9100393,9.04399223 12.7633372,8.85281521 12.5623556,8.736875 L11.6082847,8.185625 C11.7893539,7.40609544 11.7893539,6.59536289 11.6082847,5.81583333 L12.5623556,5.26458333 C12.7633372,5.14864312 12.9100393,4.9574661 12.9701458,4.73316564 C13.0302524,4.50886517 12.9988322,4.26984227 12.8828068,4.06875 L12.2273383,2.93270833 C12.1115362,2.73148712 11.9205868,2.58461004 11.6965534,2.52443187 C11.4725201,2.46425369 11.2337818,2.49571128 11.032929,2.611875 L10.0774016,3.16458333 C9.49400565,2.61782234 8.79351153,2.2117896 8.02942656,1.9775 L8.02942656,0.875 C8.02942656,0.391750844 7.63814222,6.47630098e-17 7.15546853,6.47630098e-17 Z M8.5,7 C8.5,8.1045695 7.6045695,9 6.5,9 C5.3954305,9 4.5,8.1045695 4.5,7 C4.5,5.8954305 5.3954305,5 6.5,5 C7.03043298,5 7.53914081,5.21071368 7.91421356,5.58578644 C8.28928632,5.96085919 8.5,6.46956702 8.5,7 Z" transform="translate(2.5 2)"></path></svg>`,
    spannameID: "item_menu_options_name",
    htmlExtra: ``,
    styleIconExtra: ``,
    stylePrinc: ``
}];

item_Menu.forEach((item_value, item_index, item_array) => {
    let attrF = '';
    let classF = '';
    item_value.attrs.forEach((attr_value, attr_index, attr_array) => {
        attrF += `${attr_value}="" `;
    });
    item_value.classnames.forEach((class_value, class_index, class_array) => {
        classF += `${class_value} `;
    });
    $('.itens-fixed').append(`
    <div class="itens-button ${classF}" style="${item_value.stylePrinc}" data-internal-name="${item_value.datainternalname}" ${attrF}>
        <div class="have-ot">
            <div class="itens-icon animation-default" style="${item_value.styleIconExtra}">${item_value.icon}</div>
            <span class="itens-span-name" id="${item_value.spannameID}"></span>
        </div>
        ${item_value.htmlExtra}
    </div>
    `);
});
//Menu

function openModule(event, moduleID) {
    if (typeof event == "string") {
        moduleID = event;
        event = null;
    }

    if ($('.country-gp-dnn').length == 0) {
        $('.util-app').append(`<div class="country-gp-dnn"></div>`);
    }
    openApp();

    setTimeout(() => {
        switch (moduleID ? moduleID : $(this).attr('data-internal-name')) {
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
                                <div class="option-contents" type="geral">
                                    <span><span class="fa fa-long-arrow-alt-right"></span> ${lang.item_options_menu_general}</span>
                                </div>
                                <div class="option-contents" type="discord">
                                    <span><span class="fab fa-discord"></span> ${lang.item_options_menu_discord}</span>
                                </div>
                                <div class="option-contents" type="video">
                                    <span><span class="fa fa-video"></span> ${lang.item_options_menu_sound_video}</span>
                                </div>
                                <div class="option-contents" type="temas">
                                    <span><span class="fa fa-paint-brush"></span> ${lang.item_options_menu_theme}</span>
                                </div>
                                <div class="option-contents" type="rss">
                                    <span><span class="fa fa-rss-square"></span> ${lang.item_options_menu_feed_RSS}</span>
                                </div>
                                <div class="option-contents" type="translate">
                                    <span><span class="fa fa-language"></span> ${lang.item_options_menu_translate}</span>
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
                            <div class="separador" style="width: 2px; height: 100%;"></div>
                            <div id="option-right-sidebar">
                                <div style="display: block; padding: 0 10px;" id="general-box"></div>
                                <div style="display: block; padding: 0 10px;" id="discord-box"></div>
                                <div style="display: none; -webkit-clip-path: circle(200% at 50% 50%); clip-path: circle(200% at 50% 50%); padding: 0 10px;" id="theme-box" class="animation-default"></div>
                                <div style="display: block; padding: 0 10px;" id="soon-box"></div>
                            </div>
                        </div>
                    </div>
                    `);
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
                                    <div class="game-add-button">
                                        <span><span class="fa fa-plus"></span></span>
                                    </div>
                                    <div class="game-add-footer animation-default">
                                        <span class="footer-title">Add Game</span>
                                        <span class="footer-descripition animation-default">Adicione games a sua lista.</span>
                                    </div>
                                    <label for="game_exe"></label>
                                    <input type="file" id="game_exe" name="game_exe" accept=".exe" style="display: none;"></input>
                                </div>
                            </div>
                            <div class="expo-game-fT46of">
                                <div class="is-overlay animation-default" id="over-gi592n" style="display: none; opacity: 0;"></div>
                            </div>
                        </div>
                        `);
                    eventEmitter.emit('Game_Module_Open');
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
                                    <div class="player-playlist animation-default" style="width: 0px; z-index: -1; min-width: 0px;">
                                        <div class="infinity-dock-resize-handle resize-right"></div>
                                        <div class="infinity-dock-cursor-overlay"></div>
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
                                <div id="TextEditor-editor">
                                    <div id="TextEditor-editor-tabs"></div>
                                    <div class="shadow top"></div>
                                </div>
                            </div>
                        </div>
                    `);
                }
                startTextEditor();
                break;
            case 'util-calendar':
                IAPI.init({
                    state: 'Calendario',
                    active: false
                });
                initCalendar();
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
                        startPlayerTwitch('monstercat')
                    }
                } else {
                    if ($('#util-soon').length == 0) {
                        $('.country-gp-dnn').append(`
                        <div style="visibility: hidden;" id="util-soon">
                            <div class="soon-2tfY60">
                                <div class="connecting-animation-container" data-radium="true">
                                    <span class="connecting-animation-outer"></span>
                                    <span class="connecting-animation-inner"></span>
                                    <span class="connecting-animation-icon"></span>
                                </div>
                                <span>${lang.twitch_not_available}</span>
                            </div>
                        </div>
                        `);
                    }
                    $('.back-o4f98s').css('display', 'block');
                    setTimeout(() => {
                        $('.back-o4f98s').css('opacity', '1');
                    }, 10);
                }
                break;
            default:
                $('.country-gp-dnn').append(`
                <div style="visibility: hidden;" id="util-soon">
                    <div class="soon-2tfY60">
                        <span>${lang.resource_not_available}</span>
                    </div>
                </div>
                `);
                $('.back-o4f98s').css('display', 'block');
                setTimeout(() => {
                    $('.back-o4f98s').css('opacity', '1');
                }, 10);
                break;
        }
    }, Math.random() * 1000);
    eventEmitter.emit('onStartupApp');
    setTimeout(() => {
        $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#util-soon').css('visibility', 'visible');
        $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#' + (moduleID ? moduleID : $(this).attr('data-internal-name'))).css('visibility', 'visible');
        $('.util-app').contents().filter('.loading-init').remove();
    }, 1500);
    LeftM = false;
    RightM = false;
    $(this).removeClass('active');
    i = 0;
    clearInterval(timeOut);
    return;
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
            if ($('#right-mouse-options').length > 0) {
                $('#right-mouse-options').remove();
            }
            $('.downmost').append(`<div id="right-mouse-options" style="left: auto; right: auto; bottom: auto; top: auto;"><div id="container-options"></div></div>`);

            switch ($(this).attr('data-internal-name')) {
                case 'util-game':
                    let lite = [{
                        id: "module-rmouse-play-easy",
                        text: "Jogos rapidos",
                        generator: function() {
                            setTimeout(() => {
                                eventEmitter.emit('extra_game');
                                setTimeout(() => {
                                    $('.play_easy').css('opacity', '1');
                                    $('.play_easy').css('display', 'flex');
                                    $('#right-mouse-options').remove();
                                }, 10);
                            }, 10);
                        }
                    }];
                    lite.forEach((value, index, array) => {
                        $('#right-mouse-options>#container-options').append(`<div class="options-item" id="${value.id}"><span>${value.text}</span></div>`);
                        $(`#${value.id}`).click(value.generator);
                    });
                    break;
                default:
                    break;
            }
            CLOSE_MENU = true;

            if ($('#right-mouse-options').children('#container-options').children().length > 0) {
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
            } else if ($('#right-mouse-options').children('#container-options').children().length <= 0) {
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
    .on('dblclick', openModule)
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