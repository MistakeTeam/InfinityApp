const Track = require('./Track');

module.exports = {
    "timestamp": Number,
    "context": {
        "external_urls": {
            "spotify": String
        },
        "href": String,
        "type": String,
        "uri": String
    },
    "progress_ms": Number,
    "item": Track,
    "is_playing": Boolean
}