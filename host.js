var express = require('express');
var app = express();
var session = require("express-session");
var path = require('path');
var request = require('request');
var pug = require('pug');
var fs = require('fs');
var http = require('http').Server(app);
var File = require('./File.js');
const { themes } = require('./theme.js');
var isDev = require('electron-is-dev');
const log = require("fancy-log");

//===============EXPRESS=================

// view engine setup
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use("/base", express.static(path.resolve(process.env.APPDATA + "/InfinityApp/")));

app.get('/', function(req, res) {
    console.log('Bem-vindo!!');
    File.ReadFile('gamesDB.json', data => {
        var filesave = JSON.parse(data);
        console.log(filesave);

        res.render("index", {
            games: filesave.games,
            themes: themes
        });
    });
});
app.use('/img', express.static(path.join(__dirname, '/app/public/img')));
app.use('/js', express.static(path.join(__dirname, '/app/public/js')));
app.use('/css', express.static(path.join(__dirname, '/app/public/css')));

app.get('/err', function(req, res) {
    res.redirect('/');
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 404);
    res.render('error');
});

//Status
app.use(require('express-status-monitor')({
    title: 'Infinity Status',
    path: '/status',
    port: 8000,
    spans: [{
        interval: 1, // Every second
        retention: 60 // Keep 60 datapoints in memory
    }, {
        interval: 5, // Every 5 seconds
        retention: 60
    }, {
        interval: 15, // Every 15 seconds
        retention: 60
    }]
}));
app.use(require('express-favicon-short-circuit'));

app.get('/status/:statusCode', (req, res) => res.sendStatus(req.params.statusCode));

function checkAuth(req, res, next) {
    if (isDev) return next();
    if (req.isAuthenticated()) return next();
    return res.redirect('/login');
    //res.send('not logged in :(');
}

try {
    http.listen(8000, function() {
        log.info("http://localhost:8000/");
    });
} catch (err) {
    log.info("Falha ao abrir a interface web do InfinityApp");
}