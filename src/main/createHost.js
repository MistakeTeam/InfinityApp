'use strict';

const express = require('express'),
    app = express(),
    http = require('http'),
    server = new http.Server(app),
    path = require('path');

app.set("view engine", "pug");
app.set('views', path.join(__dirname, '../app/views'));
app.use(express.static(path.join(__dirname, '../app/public')));

app.get('/', async function(req, res) {
    res.render('index');
});

try {
    server.listen(0, function() {
        console.log(`[host] http://localhost:${server.address().port}/ is online!`);
    });
} catch (err) {
    console.log("[host] Falha ao abrir a interface web do InfinityApp");
}

module.exports = { app: app, port: server.address().port };