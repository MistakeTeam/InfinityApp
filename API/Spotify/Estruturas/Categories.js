module.exports = {
    "categories": {
        "href": String,
        "items": Array({
            "href": String,
            "icons": Array({
                "height": Number,
                "url": String,
                "width": Number
            }),
            "id": String,
            "name": String
        }),
        "limit": Number,
        "next": String,
        "offset": Number,
        "previous": null,
        "total": Number
    }
}