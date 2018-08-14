const low = require('lowdb'),
    FileSync = require('lowdb/adapters/FileSync'),
    options = new FileSync(`${process.env.APPDATA}/infinityapp/db.json`),
    games = new FileSync(`${process.env.APPDATA}/infinityapp/games.json`),
    DB = low(options),
    gamesDB = low(games),
    fs = require('fs'),
    folder_path = `${process.env.APPDATA}/InfinityApp`;

(async() => {
    if (fs.existsSync(`${folder_path}/db.json`)) {
        if (fs.readFileSync(`${folder_path}/db.json`) == '{}') {
            await DB.defaults({
                    id: "",
                    themeCookie: {},
                    calendar: [],
                    options: {
                        AnimationRun: false,
                        wallpaper: "",
                        rich: false,
                        pip: false,
                        lang: "pt-br"
                    },
                    fristNotifier: true,
                    fristOpenApp: false
                })
                .write();
        }
    }

    if (fs.existsSync(`${folder_path}/games.json`)) {
        if (fs.readFileSync(`${folder_path}/games.json`) == '{}') {
            await gamesDB.defaults({
                    games: []
                })
                .write();
        }
    }

    if (!fs.existsSync(`${folder_path}/games`)) {
        fs.mkdirSync(`${folder_path}/games`);
        fs.chmodSync(`${folder_path}/games`, '777');
        if (!fs.existsSync(`${folder_path}/games/icons`)) {
            fs.mkdirSync(`${folder_path}/games/icons`);
            fs.chmodSync(`${folder_path}/games/icons`, '777');
        }
    }

    if (!fs.existsSync(`${folder_path}/themes`)) {
        fs.mkdirSync(`${folder_path}/themes`);
        fs.chmodSync(`${folder_path}/themes`, '777');
    }

    if (!fs.existsSync(`${folder_path}/wallpaper`)) {
        fs.mkdirSync(`${folder_path}/wallpaper`);
        fs.chmodSync(`${folder_path}/wallpaper`, '777');
    }
})();

module.exports = {
    DB,
    gamesDB
}