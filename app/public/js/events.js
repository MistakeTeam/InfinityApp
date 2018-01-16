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

    $(document).keydown(function(event) {
        if (event.which == 27) {
            // eventEmitter.emit('onmain');
            $('.util-app').css('transform', 'scale(1.1, 1.1)');
            $('.util-app').css('opacity', '0');
            $('.util-app').css('z-index', '-1');
            $('.util-app').contents().filter('.loading-2Y9J6r').remove();
            $('.back-o4f98s').css('opacity', '0');
            $('.back-o4f98s').css('pointer-events', 'none');
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
            $('#util-game').remove();
            $('#util-soon').remove();
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
        $('#util-game').remove();
        $('#util-soon').remove();
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
                            // eventEmitter.emit('onplayer');
                            $('.back-o4f98s').css('opacity', '0');
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