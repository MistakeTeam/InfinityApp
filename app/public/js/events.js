$(function() {
    var i = 0,
        timeOut = 0;

    const log = require("fancy-log");
    const path = require('path');
    var eventEmitter;
    var userAgent = navigator.userAgent.toLowerCase();
    console.log(userAgent);

    try {
        eventEmitter = require(path.resolve('./events.js')).eventEmitter;
    } catch (err) {
        eventEmitter = require(path.resolve(process.cwd(), './resources/app/events.js')).eventEmitter;
    }

    var currentMousePos = { x: -1, y: -1 };
    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
        // console.log(`x: ${currentMousePos.x}, y: ${currentMousePos.y}`);
    });

    $('.back-o4f98s').click(function() {
        $('.util-app').css('transform', 'scale(1.1, 1.1)');
        $('.util-app').css('opacity', '0');
        $('.util-app').css('z-index', '-1');
        $('.util-app').contents().filter('.loading-2Y9J6r').remove();
        // $('.back-o4f98s').css('visibility', 'hidden');
        $('.back-o4f98s').css('top', '0');
        $('.back-o4f98s').css('left', '5px');
        $('.back-o4f98s').css('opacity', '0');
        $('.back-o4f98s').css('pointer-events', 'none');
        // $('.menu-itens').css('display', 'flex');
        $('.menu-itens').css('transform', 'scale(1, 1)');
        $('.menu-itens').css('opacity', '1');
        $('.menu-itens').css('z-index', '100');
        $('.menu-topbar').css('opacity', '1');
        $('.menu-topbar').css('z-index', '200');
        setTimeout(() => {
            $('.util-app').contents().filter('.country-gp-dnn').contents().css('visibility', 'hidden');
        }, 500);
    });

    $('.itens-button').on('mousedown', function(e) {
        switch (event.which) {
            case 1:
                $(this).addClass('active');
                timeOut = setInterval(function() {
                    console.log(i++);
                }, 100);
                console.log('Left Mouse button pressed.');
                break;
            case 2:
                console.log('Middle Mouse button pressed.');
                break;
            case 3:
                console.log('Right Mouse button pressed.');
                break;
            default:
                console.log('You have a strange Mouse!');
        }
    }).bind('mouseup', function(event) {
        if (i > 15) {
            $('.downmost').append(`
            
            `);
        } else {
            // transition-function
            // $('.util-app').css('background-color', $(this).css('background-color'));
            $('.util-app').css('transform', 'scale(1, 1)');
            $('.util-app').css('opacity', '1');
            $('.util-app').css('z-index', '100');
            // $('.menu-itens').css('display', 'none');
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
            $('.loading-2Y9J6r').append($(this).contents('.itens-icon').clone());
            $('.loading-2Y9J6r').contents('.itens-icon').css('width', '60px');
            $('.loading-2Y9J6r').contents('.itens-icon').css('height', '60px');
            $('.loading-2Y9J6r').contents('.itens-icon').css('margin', 'auto');
            $('.loading-2Y9J6r').contents('.itens-icon').css('position', 'absolute');
            $('.loading-2Y9J6r').contents('.itens-icon').css('top', '0');
            $('.loading-2Y9J6r').contents('.itens-icon').css('bottom', '0');
            $('.loading-2Y9J6r').contents('.itens-icon').css('left', '0');
            $('.loading-2Y9J6r').contents('.itens-icon').css('right', '0');

            console.log($(this).attr('data-internal-name'));
            setTimeout(() => {
                switch ($(this).attr('data-internal-name')) {
                    case 'util-options':
                        $('.back-o4f98s').css('opacity', '1');
                        $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#' + $(this).attr('data-internal-name')).css('visibility', 'visible');
                        $('.util-app').contents().filter('.loading-2Y9J6r').remove();
                        break;
                    case 'util-game':
                        $('.back-o4f98s').css('opacity', '1');
                        $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#' + $(this).attr('data-internal-name')).css('visibility', 'visible');
                        $('.util-app').contents().filter('.loading-2Y9J6r').remove();
                        break;
                    case 'util-player':
                        eventEmitter.emit('onplayer');
                        $('.back-o4f98s').css('opacity', '0');
                        $('.back-o4f98s').css('top', '70px');
                        $('.back-o4f98s').css('left', '0');
                        $('.menu-topbar').css('z-index', '0');
                        $('.menu-topbar').css('opacity', '0');
                        $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#' + $(this).attr('data-internal-name')).css('visibility', 'visible');
                        $('.util-app').contents().filter('.loading-2Y9J6r').remove();
                        break;
                    default:
                        $('.back-o4f98s').css('opacity', '1');
                        $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#util-soon').css('visibility', 'visible');
                        $('.util-app').contents().filter('.loading-2Y9J6r').remove();
                        break;
                }
            }, Math.random() * 1000);
        }
        $(this).removeClass('active');
        i = 0;
        clearInterval(timeOut);
    });

    $('.switch').click(function(event) {
        if ($(this).children('.cmn-toggle').attr('data-check') == 'false') {
            $(this).children('.cmn-toggle').attr('data-check', 'true');
            $(this).children('.cmn-toggle').attr('checked', '');
            $(this).children('.cmn-toggle').attr('active', '');
        } else {
            $(this).children('.cmn-toggle').attr('data-check', 'false');
            $(this).children('.cmn-toggle').removeAttr('checked');
            $(this).children('.cmn-toggle').removeAttr('active');
        }
    });
});