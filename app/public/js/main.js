'use strict';

//--------------------------------------------
//--------------VARIABLES---------------------
//--------------------------------------------

const {
    app,
    BrowserWindow,
    clipboard,
    Cookies,
    crashReporter,
    desktopCapturer,
    remote
} = require('electron');

const request = require('request');

var menu_active = false;
var config_active = false;
var homeb = false;
var gamesb = false;
var chatb = false;
var File = require(__dirname + '/File.js');

//--------------------------------------------
//--------------FUNCTIONS---------------------
//--------------------------------------------

const makeDummyCall = () => setTimeout(() => {
    const code = 200 + Math.random() * 399;
    request.get(`http://localhost:8000/status/${code}`);

    makeDummyCall();
}, 50);

makeDummyCall();

function minimize() {
    var window = remote.getCurrentWindow();
    window.minimize();
}

function maximize() {
    var window = remote.getCurrentWindow();
    console.log(window.isMaximized());
    if (window.isMaximized()) {
        window.restore();
    } else {
        window.maximize();
    }
}

function close() {
    var window = remote.getCurrentWindow();
    return window.close();
}

function Menu_toogle(nameClass) {
    var spacer = $('.spacer');
    var home = $('.inicio');
    var games = $('.games');
    var chat = $('.chatarea');

    switch (nameClass) {
        case 'start-home':
            if (homeb) {
                home.css('transform', 'scaleX(1) scaleY(1)');
                home.css('opacity', '1');
                home.css('z-index', '300');

                games.css('transform', 'scaleX(0.9) scaleY(0.9)');
                games.css('opacity', '0');
                games.css('z-index', '0');

                chat.css('transform', 'scaleX(0.9) scaleY(0.9)');
                chat.css('opacity', '0');
                chat.css('z-index', '0');

                spacer.addClass('start-home');
                spacer.removeClass('start-games');
                spacer.removeClass('start-chat');

                homeb = true;
                gamesb = false;
                chatb = false;
            } else {
                home.css('transform', 'scaleX(1) scaleY(1)');
                home.css('opacity', '1');
                home.css('z-index', '300');

                games.css('transform', 'scaleX(0.9) scaleY(0.9)');
                games.css('opacity', '0');
                games.css('z-index', '0');

                chat.css('transform', 'scaleX(0.9) scaleY(0.9)');
                chat.css('opacity', '0');
                chat.css('z-index', '0');

                spacer.addClass('start-home');
                spacer.removeClass('start-games');
                spacer.removeClass('start-chat');

                homeb = true;
                gamesb = false;
                chatb = false;
            }
            break;
        case 'start-games':
            if (gamesb) {
                home.css('transform', 'scaleX(1) scaleY(1)');
                home.css('opacity', '1');
                home.css('z-index', '300');

                games.css('transform', 'scaleX(0.9) scaleY(0.9)');
                games.css('opacity', '0');
                games.css('z-index', '0');

                chat.css('transform', 'scaleX(0.9) scaleY(0.9)');
                chat.css('opacity', '0');
                chat.css('z-index', '0');

                spacer.addClass('start-home');
                spacer.removeClass('start-games');
                spacer.removeClass('start-chat');

                homeb = true;
                gamesb = false;
                chatb = false;
            } else {
                home.css('transform', 'scaleX(0.9) scaleY(0.9)');
                home.css('opacity', '0');
                home.css('z-index', '0');

                games.css('transform', 'scaleX(1) scaleY(1)');
                games.css('opacity', '1');
                games.css('z-index', '300');

                chat.css('transform', 'scaleX(0.9) scaleY(0.91)');
                chat.css('opacity', '0');
                chat.css('z-index', '0');

                spacer.removeClass('start-home');
                spacer.addClass('start-games');
                spacer.removeClass('start-chat');

                homeb = false;
                gamesb = true;
                chatb = false;
            }
            break;
        case 'start-chat':
            if (chatb) {
                home.css('transform', 'scaleX(1) scaleY(1)');
                home.css('opacity', '1');
                home.css('z-index', '300');

                games.css('transform', 'scaleX(0.9) scaleY(0.9)');
                games.css('opacity', '0');
                games.css('z-index', '0');

                chat.css('transform', 'scaleX(0.9) scaleY(0.9)');
                chat.css('opacity', '0');
                chat.css('z-index', '0');

                spacer.addClass('start-home');
                spacer.removeClass('start-games');
                spacer.removeClass('start-chat');

                homeb = true;
                gamesb = false;
                chatb = false
            } else {
                home.css('transform', 'scaleX(0.9) scaleY(0.9)');
                home.css('opacity', '0');
                home.css('z-index', '0');

                games.css('transform', 'scaleX(0.9) scaleY(0.9)');
                games.css('opacity', '0');
                games.css('z-index', '0');

                chat.css('transform', 'scaleX(1) scaleY(1)');
                chat.css('opacity', '1');
                chat.css('z-index', '300');

                spacer.removeClass('start-home');
                spacer.removeClass('start-games');
                spacer.addClass('start-chat');

                homeb = false;
                gamesb = false;
                chatb = true;
            }
            break;
        default:
            break;
    }
}

function addTooltip(atiador) {
    switch (atiador) {
        case "menu":
            if (!menu_active) {
                var app = $('.app');
                var card = $(`
                <div class="tooltip tooltip-bottom tooltip-black animation-default" style="transform: scaleX(0.9) scaleY(0.9); opacity: 0; z-index: 0;">
                    <div class="tooltip-config" style="height: 84%; background: rgba(0, 0, 0, 0.2);"></div>
                    <div class="tooltip-menu-bar">
                        <div class="tooltip-button">
                            <img style='background: url("../img/icons8/dusk/Sair.png") no-repeat; background-size: 100% 100%;'/>
                            <span>Minha Conta</span>
                        </div>
                        <div class="tooltip-button">
                            <img style='background: url("../img/icons8/dusk/Sair.png") no-repeat; background-size: 100% 100%;'/>
                            <span>Privacidade e Segurança</span>
                        </div>
                        <div class="separator" style="width: 1px; height: 100px"></div>
                        <div class="tooltip-button">
                            <img style='background: url("../img/icons8/dusk/Sair.png") no-repeat; background-size: 100% 100%;'/>
                            <span>jogos</span>
                        </div>
                        <div class="separator" style="width: 1px; height: 100px"></div>
                        <div class="tooltip-button desconnect">
                            <img style='background: url("../img/icons8/dusk/Sair.png") no-repeat; background-size: 100% 100%;'/>
                            <span>Desconectar</span>
                        </div>
                    </div>
                </div>`);
                card.appendTo('.tooltips');

                card.css('transform', 'scaleX(1) scaleY(1)');
                card.css('opacity', '1');
                card.css('z-index', '300');

                app.css('transform', 'scaleX(0.9) scaleY(0.9)');
                app.css('opacity', '0');
                app.css('z-index', '0');

                menu_active = true;
            } else {
                var app = $('.app');
                var card = $('.tooltips').children('.tooltip');

                app.css('transform', 'scaleX(1) scaleY(1)');
                app.css('opacity', '1');
                app.css('z-index', '300');

                card.css('transform', 'scaleX(0.9) scaleY(0.9)');
                card.css('opacity', '0');
                card.css('z-index', '0');

                card.remove();
                menu_active = false;
            }
            break;
        default:
            break;
    }
}

function addThemeDark(atiador) {
    switch (atiador) {
        case "config":
            if (!config_active && gamesb) {
                var card = $(`
                <div class="game-config" style="top: 70px; left: -35px;">
                    <div class="tooper-bar">
                        <span class="tooper-title">Configurações</span>
                        <div class="close"></div>
                    </div>
                    <div class="config-content">
                        <div class="ui-form-item">
                            <h5 class="h5-3KssQU title-1pmpPr size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH defaultMarginh5-2UwwFY marginBottom8-1mABJ4">
                                <!-- react-text: 646860 -->Atraso na voz após soltar o pressionar-para-falar<!-- /react-text -->
                            </h5>
                            <div class="slider-2e2iXJ">
                                <input type="number" class="input-27JrJm" value="1" readonly="">
                                <div class="track-1h2wOF">
                            </div>
                            <div class="bar-2cFRGz">
                                <div class="barFill-18ABna" style="width: 0%;">
                            </div>
                            </div>
                            <div class="track-1h2wOF">
                                <div class="grabber-1TZCZi" style="left: 0%;">
                                    <span class="bubble-17BwqU elevationHigh-3lNfp9">0%</span>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div class="ui-select">
                            <div class="Select Select--single has-value">
                                <div class="Select-control">
                                    <span class="Select-multi-value-wrapper" id="react-select-51--value">
                                        <div class="Select-value">
                                            <span class="Select-value-label" role="option" aria-selected="true" id="react-select-51--value-item">VoiceMeeter Output (VB-Audio Vo</span>
                                        </div>
                                        <div role="combobox" aria-expanded="false" aria-owns="" aria-activedescendant="react-select-51--value" class="Select-input" tabindex="0" aria-readonly="false" style="border: 0px; width: 1px; display: inline-block;"></div>
                                    </span>
                                    <span class="Select-arrow-zone">
                                        <span class="Select-arrow"></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="search">
                            <div class="search-bar">
                                <div class="DraftEditor-root">
                                    <div class="public-DraftEditorPlaceholder-root">
                                    <div class="public-DraftEditorPlaceholder-inner">Procurar</div>
                                </div>
                                <div class="DraftEditor-editorContainer">
                                    <input class="path-text" type="text">
                                </div>
                            </div>
                            <div class="search-bar-icon">
                                <i class="icon icon-search-bar-eye-glass visible"></i>
                                <i class="icon icon-search-bar-clear"></i>
                            </div>
                        </div>
                    </div>
                        <button class="select-path">Salvar</button>
                    </div>
                </div>
                `);

                card.appendTo('.theme-dark');
                config_active = true;
            } else {
                $('.theme-dark').children('.game-config').remove();
                config_active = false;
            }
            break;
        default:
            break;
    }
}

//--------------FUNCTIONS LIST GAMES---------------------
function reload_games() {
    let listgames = JSON.parse(fs.readFileSync('../../../config/options.json', 'utf8'));
    $(div).contents('.games-item').remove();
}

function add_games() {
    let listgames = JSON.parse(fs.readFileSync('../../../config/options.json', 'utf8'));
}

function remove_games() {
    let listgames = JSON.parse(fs.readFileSync('../../../config/options.json', 'utf8'));
}



//--------------------------------------------
//--------------ALL TIME----------------------
//--------------------------------------------

$(document).ready(function() {
    if (!gamesb) {
        $('.theme-dark').children('.game-config').remove();
        config_active = false;
    }
});