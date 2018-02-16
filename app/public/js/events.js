$(function() {
    var i = 0,
        timeOut = 0,
        LeftM, RightM = false;


    const path = require('path');
    var eventEmitter;
    var userAgent = navigator.userAgent.toLowerCase();
    console.log(userAgent);

    try {
        eventEmitter = require(path.resolve('./lib/events.js')).eventEmitter;
    } catch (err) {
        eventEmitter = require(path.resolve(process.cwd(), './resources/app.asar/lib/events.js')).eventEmitter;
    }

    var currentMousePos = { x: -1, y: -1 };
    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    });

    // $(document).keydown(function(event) {
    //     console.log(event.which);
    // });

    $(document).keydown(function(event) {
        if (event.which == 27) {
            // eventEmitter.emit('onmain');
            $('.util-app').css('transform', 'scale(1.1, 1.1)');
            $('.util-app').css('opacity', '0');
            $('.util-app').css('z-index', '-1');
            $('.util-app').contents().filter('.loading-2Y9J6r').remove();
            $('.back-o4f98s').css('opacity', '0');
            $('.back-o4f98s').css('pointer-events', 'none');
            $('.back-o4f98s').css('display', 'block');
            $('.menu-itens').css('transform', 'scale(1, 1)');
            $('.menu-itens').css('opacity', '1');
            $('.menu-itens').css('z-index', '100');
            $('.menu-topbar').css('opacity', '1');
            $('.menu-topbar').css('z-index', '200');
            if ($('.game-item-T5e87d') != undefined) {
                $('.game-item-T5e87d').remove();
            }
            if ($('#option-right-sidebar').children().children() != undefined) {
                $('#option-right-sidebar').children().children().remove();
            }
            $('.country-gp-dnn').remove();
            if ($('#player-script') != undefined) {
                $('#player-script').remove();
            }
            setTimeout(() => {
                $('.util-app').contents().filter('.country-gp-dnn').contents().css('visibility', 'hidden');
            }, 500);
        }
    });

    $('.back-o4f98s').click(function() {
        // eventEmitter.emit('onmain');
        $('.util-app').css('transform', 'scale(1.1, 1.1)');
        $('.util-app').css('opacity', '0');
        $('.util-app').css('z-index', '-1');
        $('.util-app').contents().filter('.loading-2Y9J6r').remove();
        $('.back-o4f98s').css('opacity', '0');
        $('.back-o4f98s').css('pointer-events', 'none');
        $('.back-o4f98s').css('display', 'block');
        $('.menu-itens').css('transform', 'scale(1, 1)');
        $('.menu-itens').css('opacity', '1');
        $('.menu-itens').css('z-index', '100');
        $('.menu-topbar').css('opacity', '1');
        $('.menu-topbar').css('z-index', '200');
        if ($('.game-item-T5e87d') != undefined) {
            $('.game-item-T5e87d').remove();
        }
        if ($('#option-right-sidebar').children().children() != undefined) {
            $('#option-right-sidebar').children().children().remove();
        }
        $('.country-gp-dnn').remove();
        if ($('#player-script') != undefined) {
            $('#player-script').remove();
        }
        setTimeout(() => {
            $('.util-app').contents().filter('.country-gp-dnn').contents().css('visibility', 'hidden');
        }, 500);
    });

    $('.itens-button').on('mousedown', function(event) {
            switch (event.which) {
                case 1:
                    LeftM = true;
                    $(this).addClass('active');
                    timeOut = setInterval(function() {
                        i++;
                    }, 100);
                    console.log('Left Mouse button pressed.');
                    break;
                case 3:
                    if ($(this).attr('play_easy') == '') {
                        $(this).children().children('.itens-icon').css('width', '20%');
                        $(this).children().children('.itens-icon').css('bottom', '35px');
                        $(this).children().children('.itens-icon').css('left', '-60px');
                        $(this).children('.play_easy').css('opacity', '1');
                        $(this).children('.play_easy').css('display', 'flex');
                        eventEmitter.emit('extra_game');
                    }
                    RightM = true;
                    console.log('Right Mouse button pressed.');
                    break;
                default:
                    console.log('You have a strange Mouse!');
            }
        })
        .bind('mouseup', function(event) {
            if (i > 15) {
                $('.downmost').append(``);
                $(this).removeClass('active');
                i = 0;
                clearInterval(timeOut);
                return;
            } else if (i < 15 && LeftM && !RightM) {
                $('.util-app').append(`<div class="country-gp-dnn"></div>`);

                // transition-function
                $('.util-app').css('transform', 'scale(1, 1)');
                $('.util-app').css('opacity', '1');
                $('.util-app').css('z-index', '100');
                $('.menu-itens').css('transform', 'scale(0.9, 0.9)');
                $('.menu-itens').css('opacity', '0');
                $('.menu-itens').css('z-index', '0');
                $('.back-o4f98s').css('pointer-events', 'auto');

                // loading
                $('.util-app').append(`
                <div class="loading-2Y9J6r">
                    <div class="lds-css ng-scope" style="width: 200px; height: 200px;">
                        <div style="width:100%; height:100%" class="lds-eclipse">
                            <div></div>
                        </div>
                    </div>
                </div>
                `);

                // icon-clone
                $('.loading-2Y9J6r').append($(this).children('.have-ot').children('.itens-icon').clone());
                $('.loading-2Y9J6r').contents('.itens-icon').css('width', '60px');
                $('.loading-2Y9J6r').contents('.itens-icon').css('height', '60px');
                $('.loading-2Y9J6r').contents('.itens-icon').css('margin', 'auto');
                $('.loading-2Y9J6r').contents('.itens-icon').css('position', 'absolute');
                $('.loading-2Y9J6r').contents('.itens-icon').css('top', '0');
                $('.loading-2Y9J6r').contents('.itens-icon').css('bottom', '0');
                $('.loading-2Y9J6r').contents('.itens-icon').css('left', '0');
                $('.loading-2Y9J6r').contents('.itens-icon').css('right', '0');

                setTimeout(() => {
                    switch ($(this).attr('data-internal-name')) {
                        case 'util-options':
                            $('.country-gp-dnn').append(`
                            <div style="visibility: hidden;" id="util-options">
                                <div class="app-configuration">
                                    <div id="option-left-sidebar">
                                        <div class="option-contents selected-item" type="geral">
                                            <span>Geral</span>
                                        </div>
                                        <div class="option-contents" type="temas">
                                            <span>Temas</span>
                                        </div>
                                        <div class="separador" style="width: 100%; height: 1px;"></div>
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
                                        <div style="display: block;" id="general-box"></div>
                                        <div style="display: none;" id="theme-box"></div>
                                    </div>
                                </div>
                            </div>
                            `);
                            eventEmitter.emit('OptionContentsClick');
                            $('.back-o4f98s').css('opacity', '1');
                            $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#' + $(this).attr('data-internal-name')).css('visibility', 'visible');
                            $('.util-app').contents().filter('.loading-2Y9J6r').remove();
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
                            $('.option-contents').removeClass('selected-item');
                            $('#option-right-sidebar').children().css('display', 'none');
                            $('#general-box').css('display', 'block');
                            $('.option-contents').each((index, op) => {
                                if ($(op).attr('type') == 'geral') {
                                    $(op).addClass('selected-item');
                                }
                            })
                            break;
                        case 'util-game':
                            $('.country-gp-dnn').append(`
                            <div style="visibility: hidden;" id="util-game">
                                <div class="games-H5wY75">
                                    <div class="game-add-F58dY4">
                                        <div class="game-add-button"></div>
                                        <div class="game-add-footer animation-default">
                                            <span class="footer-title">Add Game</span>
                                            <span class="footer-descripition animation-default" style="opacity: 0;">Adicione games a sua lista.</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="expo-game-fT46of">
                                    <div class="is-overlay animation-default" id="over-gi592n" style="display: none; opacity: 0;"></div>
                                </div>
                            </div>
                            `);
                            eventEmitter.emit('Game_Module_Open');
                            // eventEmitter.emit('ongames');
                            eventEmitter.emit('open-module-games');
                            $('.back-o4f98s').css('opacity', '1');
                            $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#' + $(this).attr('data-internal-name')).css('visibility', 'visible');
                            $('.util-app').contents().filter('.loading-2Y9J6r').remove();
                            break;
                        case 'util-player':
                            $('.country-gp-dnn').append(`<div style="visibility: hidden;" id="util-player"><div><div class="player-T1ow86"><div class="is-overlay animation-default" id="over-Rtj493" style="display: none; opacity: 0.85;"></div><div class="player-playlist animation-default" style="display: none; opacity: 0; transform: scale(0.9, 0.9); z-index: -1;"><div class="icon-close" style="position: absolute; width: 25px; height: 25px;" id="close-o69J50"></div><div class="playlist-contains"><div class="buttons-actions-playlist"><div class="add-playlist"><input type="file" id="pb-input" accept="video/* , audio/*" multiple="" style="display: none;"><label class="animation-default" for="pb-input"><svg class="ply-button" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Your_Icon" x="0px" y="0px" fill="#fff" width="30px" height="30px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><circle cx="18.132" cy="26.545" r="7.131"></circle><rect x="33.619" y="21.486" width="56.292" height="10.118"></rect><circle cx="18.132" cy="51.219" r="7.131"></circle><rect x="33.619" y="46.159" width="56.292" height="10.118"></rect><circle cx="18.132" cy="76.033" r="7.131"></circle><rect x="33.619" y="70.975" width="56.292" height="10.117"></rect></svg></label></div></div><div class="list-itens-playlist"></div></div></div><div class="player-video"><div class="back-video"></div><video id="getduration" src="" autoplay="" style="display:none;"></video><video src="" id="pb-video" onclick="play_video()" autoplay=""></video></div><div class="player-controls-botton"><div class="player-progress-bar"><div class="progress-bar"></div><div id="progress-loader"></div></div><div class="player-controls"><div class="controls-left"><div class="ply-time-display notranslate"><span id="ply-time-current">--:--</span><span id="ply-time-separator"> / </span><span id="ply-time-duration">--:--</span></div></div><div class="controls-middle"><a class="ply-previous-button ply-button animation-default" style="transform: rotate(180deg);" aria-disabled="false" data-duration="26:14" data-preview="https://i.ytimg.com/vi/1oCbeBykAfo/mqdefault.jpg" data-tooltip-text="O TOUR, PARTE 1! com Viniccius13 e Davi // Meu Mundo #101 // Minecraft" title="Próximo"><svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ply-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ply-id-13"></use><path class="ply-svg-fill" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" id="ply-id-13"></path></svg></a><button class="ply-play-button ply-button animation-default" aria-label="Reproduzir" onclick="play_video()"><svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ply-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ply-id-28"></use><path class="ply-svg-fill animation-default" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ply-id-28"></path></svg></button><a class="ply-next-button ply-button animation-default" aria-disabled="false" data-duration="26:14" data-preview="https://i.ytimg.com/vi/1oCbeBykAfo/mqdefault.jpg" data-tooltip-text="O TOUR, PARTE 1! com Viniccius13 e Davi // Meu Mundo #101 // Minecraft" title="Próximo"><svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ply-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ply-id-13"></use><path class="ply-svg-fill" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" id="ply-id-13"></path></svg></a></div><div class="controls-right"><div><label class="animation-default" id="playlist-open-y40so9"><svg class="ply-button" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Your_Icon" x="0px" y="0px" fill="#fff" width="30px" height="30px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><circle cx="18.132" cy="26.545" r="7.131"></circle><rect x="33.619" y="21.486" width="56.292" height="10.118"></rect><circle cx="18.132" cy="51.219" r="7.131"></circle><rect x="33.619" y="46.159" width="56.292" height="10.118"></rect><circle cx="18.132" cy="76.033" r="7.131"></circle><rect x="33.619" y="70.975" width="56.292" height="10.117"></rect></svg></label></div><span style="display: grid; position: relative;"><button class="ply-mute-button ply-button animation-default" data-visual-id="5" title="Sem áudio"><svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ply-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ply-id-15"></use><use class="ply-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ply-id-16"></use><defs><clipPath id="ply-svg-volume-animation-mask"><path d="m 14.35,-0.14 -5.86,5.86 20.73,20.78 5.86,-5.91 z"></path><path d="M 7.07,6.87 -1.11,15.33 19.61,36.11 27.80,27.60 z"></path><path class="ply-svg-volume-animation-mover" d="M 9.09,5.20 6.47,7.88 26.82,28.77 29.66,25.99 z" transform="translate(0, 0)"></path></clipPath><clipPath id="ply-svg-volume-animation-slash-mask"><path class="ply-svg-volume-animation-mover" d="m -11.45,-15.55 -4.44,4.51 20.45,20.94 4.55,-4.66 z" transform="translate(0, 0)"></path></clipPath></defs><path class="ply-svg-fill ply-svg-volume-animation-speaker" clip-path="url(#ply-svg-volume-animation-mask)" d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z" fill="#fff" id="ply-id-15"></path><path class="ply-svg-fill ply-svg-volume-animation-hider" clip-path="url(#ply-svg-volume-animation-slash-mask)" d="M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z" fill="#fff" id="ply-id-16" style="display: none;"></path></svg></button><div class="ply-volume-panel animation-default" role="slider" aria-valuemin="0" aria-valuemax="100" tabindex="0" aria-valuenow="100" aria-valuetext="100% volume"><div class="ply-volume-slider" style="touch-action: none;"><div class="ply-volume-slider-handle"></div></div></div></span></div></div></div></div></div></div>`);
                            $('#document-body').append(`<script id="player-script" src="/js/player.js"></script>`);
                            // eventEmitter.emit('onplayer');
                            $('.back-o4f98s').css('display', 'none');
                            $('.menu-topbar').css('z-index', '0');
                            $('.menu-topbar').css('opacity', '0');
                            $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#' + $(this).attr('data-internal-name')).css('visibility', 'visible');
                            $('.util-app').contents().filter('.loading-2Y9J6r').remove();
                            break;
                        case 'util-browser':
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
                            $('.back-o4f98s').css('display', 'none');
                            $('.menu-topbar').css('z-index', '0');
                            $('.menu-topbar').css('opacity', '0');
                            $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#' + $(this).attr('data-internal-name')).css('visibility', 'visible');
                            $('.util-app').contents().filter('.loading-2Y9J6r').remove();
                            break;
                        case 'util-TextEditor':
                            $('.country-gp-dnn').append(`
                            <div style="visibility: hidden;" id="util-TextEditor">
                                <div id="TextEditor-global">
                                    <div class="TextEditor-editor">
                                        <div class="TextEditor-line">
                                            <div class="TextEditor-line-count" style="width: 45px;">
                                                <div class="line-numbers" style="left: 19px">1</div>
                                            </div>
                                            <div class="TextEditor-line-view">
                                                <span>
                                                    <span>var i = 0;</span>
                                                </span>
                                            </div>
                                        </div>
                                        <textarea id="TextEditor-inputarea" wrap="off" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" aria-label="O editor não está acessível neste momento." role="textbox" aria-multiline="true" aria-haspopup="false" aria-autocomplete="both" style="font-size: 1px; line-height: 19px; width: 1px; height: 1px;"></textarea>
                                    </div>
                                </div>
                            </div>
                            `);
                            $('#document-body').append(`<script id="browser-script" src="/js/browser.js"></script>`);
                            $('.back-o4f98s').css('display', 'none');
                            $('.menu-topbar').css('z-index', '0');
                            $('.menu-topbar').css('opacity', '0');
                            $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#' + $(this).attr('data-internal-name')).css('visibility', 'visible');
                            $('.util-app').contents().filter('.loading-2Y9J6r').remove();
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
                            $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#util-soon').css('visibility', 'visible');
                            $('.util-app').contents().filter('.loading-2Y9J6r').remove();
                            break;
                    }
                }, Math.random() * 1000);
                $(this).removeClass('active');
                i = 0;
                clearInterval(timeOut);
                return;
            } else {}
        })
        .mouseleave(function() {
            $(this).children().children().children().css('filter', 'grayscale(100%)');
            $(this).children().children('.itens-icon').css('bottom', '0px');
            $(this).children().children('.itens-icon').css('left', '0px');
            $(this).children().children('.itens-icon').css('width', '40%');
            $(this).children('.play_easy').css('opacity', '0');
            $(this).children('.play_easy').css('display', 'none');
            $('.play_easy').children().remove();
            RightM = false;
        })
        .mouseenter(function() {
            $(this).children().children().contents($(this).children().children().children('svg') ? $(this).children().children().children('svg') : $(this).children().children().children('img')).css('filter', 'grayscale(0%)');
        })
});