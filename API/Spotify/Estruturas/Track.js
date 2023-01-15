const Album = require('./Album');
const Artist = require('./Artist');

module.exports = {
    "album": Album,
    "artists": Array(Artist),
    "available_markets": Array(String),
    "disc_number": Number,
    "duration_ms": Number,
    "explicit": Boolean,
    "external_ids": {
        "isrc": String
    },
    "external_urls": {
        "spotify": String
    },
    "href": String,
    "id": String,
    "is_local": Boolean,
    "name": String,
    "popularity": Number,
    "preview_url": String,
    "track_number": Number,
    "type": String,
    "uri": String
}