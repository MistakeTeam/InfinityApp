'use strict';

async function extra_game() {
    console.log('[module extra] play easy')
    var sla = [];

    if ($('.play_easy').length == 0) {
        $('.downmost').append(`<div style="opacity: 0; display: none;" class="play_easy animation-default">
            <div id="close-52f65u"><span class="fa fa-window-close"></span></div>
        </div>`)
    }
    if ($('.play_easy').children().length >= 0) {
        $('.play_easy').children().remove();
    }
    if (gamesData.games.length >= 12) {
        for (let i = 0; i <= 12;) {
            var indexgame = Math.floor(Math.random() * gamesData.games.length);

            if (!sla.includes(indexgame)) {
                $('.play_easy').append(`
                <div class="extra-game-N5Y65r animation-default" path="${gamesData.games[indexgame].path}" name="${gamesData.games[indexgame].name}" index="${indexgame}">
                    <img src="base/games/Icons/${gamesData.games[indexgame].thumb}" alt=""></img>
                </div>
                `);
                sla.push(indexgame);
                i++;
            }
        }
    } else if (gamesData.games.length < 12) {
        for (let i = 0; i < gamesData.games.length; i++) {
            $('.play_easy').append(`
            <div class="extra-game-N5Y65r animation-default" path="${gamesData.games[i].path}" name="${gamesData.games[i].name}" index="${i}">
                <img src="base/games/Icons/${gamesData.games[i].thumb}" alt=""></img>
            </div>
            `);
        }
    }

    CLOSE_MENU = true;
    $('.extra-game-N5Y65r')
        .on("click", playAny);
}

eventEmitter.on('extra_game', extra_game);