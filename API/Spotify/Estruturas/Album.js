const Artist = require('./Artist');

module.exports = {
    "album_type": String,
    "artists": Array(Artist),
    "available_markets": Array(String),
    "external_urls": {
        "spotify": String
    },
    "href": String,
    "id": String,
    "images": Array({
        "height": Number,
        "url": String,
        "width": Number
    }),
    "name": String,
    "release_date": String,
    "release_date_precision": String,
    "total_tracks": Number,
    "type": String,
    "uri": String
}