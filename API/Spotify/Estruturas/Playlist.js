module.exports = {
    "playlists": {
        "href": String,
        "items": Array({
            "collaborative": false,
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
            "owner": {
                "display_name": String,
                "external_urls": {
                    "spotify": String
                },
                "href": String,
                "id": String,
                "type": String,
                "uri": String
            },
            "primary_color": null,
            "public": null,
            "snapshot_id": String,
            "tracks": {
                "href": String,
                "total": Number
            },
            "type": String,
            "uri": String
        }),
        "limit": Number,
        "next": String,
        "offset": Number,
        "previous": null,
        "total": Number
    }
}