var child = require('child_process');
var File;
var eventEmitter;

try {
    File = require(path.resolve(process.cwd(), './lib/File.js'));
    eventEmitter = require(path.resolve(process.cwd(), './lib/events.js')).eventEmitter;
} catch (err) {
    File = require(path.resolve(process.cwd(), './resources/app.asar/lib/File.js'));
    eventEmitter = require(path.resolve(process.cwd(), './resources/app.asar/lib/events.js')).eventEmitter;
}

function extra_game() {
    console.log('module extra: play easy')
    File.ReadFile('gamesDB.json', data => {
        var sla = [];

        if ($('.play_easy').children().length <= 0 && data.games.length > 12) {
            for (let i = 1; i <= 12;) {
                var indexgame = Math.floor(Math.random() * data.games.length);

                if (!sla.includes(indexgame)) {
                    $('.play_easy').append(`
                    <div class="extra-game-N5Y65r animation-default" path="${data.games[indexgame].path}" index="${indexgame}">
                        <img src="base/games/Icons/${data.games[indexgame].thumb}" alt=""></img>
                    </div>
                    `);
                    sla.push(indexgame);
                    i++;
                }
            }
        } else if ($('.play_easy').children().length <= 0 && data.games.length < 12) {
            for (let i = 1; i <= 12; i++) {
                var indexgame = Math.floor(Math.random() * data.games.length);

                $('.play_easy').append(`
                <div class="extra-game-N5Y65r animation-default" path="${data.games[indexgame].path}" index="${indexgame}">
                    <img src="base/games/Icons/${data.games[indexgame].thumb}" alt=""></img>
                </div>
                `);
            }
        }

        $('.extra-game-N5Y65r').on("click", playAny);
    });
}

eventEmitter.on('extra_game', extra_game);