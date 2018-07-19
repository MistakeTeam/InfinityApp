const low = require('lowdb'),
    FileSync = require('lowdb/adapters/FileSync'),
    adapter = new FileSync(`${process.env.APPDATA}/infinityapp/db.json`),
    db = low(adapter),
    fs = require('fs');

(async() => {
    if (fs.existsSync(`${process.env.APPDATA}/infinityapp/db.json`)) {
        if (fs.readFileSync(`${process.env.APPDATA}/infinityapp/db.json`) == '{}') {
            await db.defaults({
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
})();