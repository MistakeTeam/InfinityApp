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
var gamesb = false;
var homeb = false;

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
    window.close();
}

function Menu_toogle(nameClass) {
    var spacer = $('.spacer');
    var home = $('.inicio');
    var games = $('.games');

    switch (nameClass) {
        case "start-home":
            if (homeb) {
                // spacer.css('height', '5px');
                // home.css('transform', 'scaleX(0.9) scaleY(0.9)');
                // home.css('opacity', '0');
                // home.css('z-index', '0');
                homeb = false;
            } else {
                // spacer.css('height', '35px');
                home.css('transform', 'scaleX(1) scaleY(1)');
                home.css('opacity', '1');
                home.css('z-index', '300');
                homeb = true;

                //Ocultando janelas

                games.css('transform', 'scaleX(0.9) scaleY(0.9)');
                games.css('opacity', '0');
                games.css('z-index', '0');
                gamesb = false;
            }
            break;
        case "start-games":
            if (gamesb) {
                // spacer.css('height', '5px');
                games.css('transform', 'scaleX(0.9) scaleY(0.9)');
                games.css('opacity', '0');
                games.css('z-index', '0');
                gamesb = false;

                //Retornando de vlta pro inicio

                home.css('transform', 'scaleX(1) scaleY(1)');
                home.css('opacity', '1');
                home.css('z-index', '300');
                homeb = true;
            } else {
                // spacer.css('height', '35px');
                games.css('transform', 'scaleX(1) scaleY(1)');
                games.css('opacity', '1');
                games.css('z-index', '300');
                gamesb = true;

                //Ocultando janelas

                home.css('transform', 'scaleX(0.9) scaleY(0.9)');
                home.css('opacity', '0');
                home.css('z-index', '0');
                homeb = false;
            }
            break;
        default:
            break;
    }

    //Correção das classes do menubar
    if (spacer.hasClass('start-home')) {
        spacer.removeClass('start-home');
        spacer.addClass('start-games');
    } else if (spacer.hasClass('start-games')) {
        spacer.removeClass('start-games');
        spacer.addClass('start-home');
    }
}

function addTooltip(atiador) {
    switch (atiador) {
        case "menu":
            if (!menu_active) {
                var card = $(`<div class="tooltip tooltip-bottom tooltip-black"><a class="tooltip-button"><span>Configurações</span></a><div class="separator" style="width: 200px; height: 1px; margin: 2px 0;"></div><a class="tooltip-button desconnect"><span>Desconectar</span></a></div>`);

                card.css('top', '28px');
                card.css('left', `${calcularposition($('.header-toolbar').position().left, 3.4, $('.header-toolbar').width())}px`);
                console.log($('.header-toolbar').position());
                card.appendTo('.tooltips');
                menu_active = true;
            } else {
                $('.tooltips').children('.tooltip').remove();
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
                var card = $(`<div class="game-config" style="top: 70px; left: -35px;"><div class="tooper-bar"><span class="tooper-title">Configurações</span><div class="close"></div></div><div class="config-content"><div class="search"><div class="search-bar"><div class="DraftEditor-root"><div class="public-DraftEditorPlaceholder-root"><div class="public-DraftEditorPlaceholder-inner">Procurar</div></div><div class="DraftEditor-editorContainer"><input class="path-text" type="text"></div></div><div class="search-bar-icon"><i class="icon icon-search-bar-eye-glass visible"></i><i class="icon icon-search-bar-clear"></i></div></div></div><button class="select-path">path...</button></div></div>`);

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

function calcularposition(total, pocento, tamanho) {
    var persentual = (total / 100 * pocento);
    return total + persentual;
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