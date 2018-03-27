const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/infinityapp');
mongoose.Promise = global.Promise;
const Promise = require("bluebird");
Promise.promisifyAll(require("mongoose"));
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed;

mongoose.connection.on('open', function() {
    console.log(`[mongoose] Connect OK!`)
        // mongoose.connection.db.dropDatabase(function (err) {
        //   console.log('db dropped');
        //   process.exit(0);
        // });
});

const Options = new Schema({
    id: { type: String, index: { unique: true } },
    themeCookie: { type: Object, default: {} },
    options: {
        AnimationRun: { type: Boolean, default: false },
        wallpaper: { type: String, default: "" },
        rich: { type: Boolean, default: false },
        pip: { type: Boolean, default: false },
        lang: { type: String, default: "pt-br" }
    },
    fristNotifier: { type: Boolean, default: true },
    fristOpenApp: { type: Boolean, default: false }
}, { strict: false, autoIndex: true });

const lastSessionInfo = new Schema({
    id: { type: String, index: { unique: true } },
    size: {
        width: { type: Number, default: 1080 },
        height: { type: Number, default: 600 }
    },
    position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 }
    },
    isMaximize: { type: Boolean, default: false }
}, { strict: false, autoIndex: true });

const Games = new Schema({
    id: { type: String, index: { unique: true } },
    games: { type: Array, default: [] }
}, { strict: false, autoIndex: true });

module.exports = {
    Options: mongoose.model('Options', Options, 'optionsdb'),
    Games: mongoose.model('Games', Games, 'gamesdb'),
    LastSessionInfo: mongoose.model('lastSessionInfo', lastSessionInfo, 'lastSessionInfoDB')
}