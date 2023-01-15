const Track = require('./Track');

module.exports = {
    "items": Array({
        "track": Track,
        "played_at": String,
        "context": {
            "uri": String,
            "external_urls": {
                "spotify": String
            },
            "href": String,
            "type": String
        }
    }),
    "next": String,
    "cursors": {
        "after": String,
        "before": String
    },
    "limit": Number,
    "href": String
}