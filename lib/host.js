var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var pug = require('pug');
var fs = require('fs');
var http = require('http').Server(app);
var File = require('./File.js');
const { themes } = require('../theme.js');
var isDev = require('electron-is-dev');


//===============EXPRESS=================

// view engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../app/views'));

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
app.use('/img', express.static(path.join(__dirname, '../app/public/img')));
app.use('/js', express.static(path.join(__dirname, '../app/public/js')));
app.use('/css', express.static(path.join(__dirname, '../app/public/css')));

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

try {
    http.listen(8000, function() {
        console.log("http://localhost:8000/");
    });
} catch (err) {
    console.log("Falha ao abrir a interface web do InfinityApp");
}