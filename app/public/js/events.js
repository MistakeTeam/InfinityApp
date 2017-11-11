$(function() {
    var timeoutId = 0;

    $('.itens-button').click(function() {
        // transition-function
        $('.util-app').css('background-color', $(this).css('background-color'));
        $('.util-app').css('transform', 'scale(1, 1)');
        $('.util-app').css('opacity', '1');
        $('.util-app').css('z-index', '100');
        // $('.menu-itens').css('display', 'none');
        $('.menu-itens').css('transform', 'scale(0.9, 0.9)');
        $('.menu-itens').css('opacity', '0');
        $('.menu-itens').css('z-index', '0');
        $('.back-o4f98s').css('visibility', 'visible');

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
                    $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#' + $(this).attr('data-internal-name')).css('visibility', 'visible');
                    $('.util-app').contents().filter('.loading-2Y9J6r').remove();
                    break;
                case 'util-game':
                    $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#' + $(this).attr('data-internal-name')).css('visibility', 'visible');
                    $('.util-app').contents().filter('.loading-2Y9J6r').remove();
                    break;
                default:
                    $('.util-app').contents().filter('.country-gp-dnn').contents().filter('#util-soon').css('visibility', 'visible');
                    $('.util-app').contents().filter('.loading-2Y9J6r').remove();
                    break;
            }
        }, Math.random() * 1000);
    });

    $('.back-o4f98s').click(function() {
        $('.util-app').css('transform', 'scale(1.1, 1.1)');
        $('.util-app').css('opacity', '0');
        $('.util-app').css('z-index', '-1');
        $('.util-app').contents().filter('.loading-2Y9J6r').remove();
        $('.util-app').contents().filter('.country-gp-dnn').contents().css('visibility', 'hidden');
        $('.back-o4f98s').css('visibility', 'hidden');
        // $('.menu-itens').css('display', 'flex');
        $('.menu-itens').css('transform', 'scale(1, 1)');
        $('.menu-itens').css('opacity', '1');
        $('.menu-itens').css('z-index', '100');
    });

    $('.game-add-F58dY4').mousedown(function() {
        timeoutId = setInterval(function() {
            // timeoutId++;
            console.log(`real-time: ${timeoutId} segundos(mouse hold)`);
        }, 1000);
    }).mouseup(function() {
        clearTimeout(timeoutId);
        timeoutId = 0;
    })
});