'use strict';

const express = require('express'),
    app = express(),
    http = require('http'),
    server = new http.Server(app),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    Strategy = require('passport-twitter').Strategy,
    session = require('express-session');

// passport.use(new Strategy({
//     consumerKey: 'eNB3gUMku5hzMSglGZPQIXIn5',
//     consumerSecret: 'xsMxBo8A13Klsaw7zY2doZwzvdKjMq3DjUF0Z48DsaNNq2bsfW',
//     callbackURL: 'http://localhost:35964/auth/twitter/callback'
// }, function(token, tokenSecret, profile, callback) {
//     return callback(null, profile);
// }));

// passport.serializeUser(function(user, callback) {
//     callback(null, user);
// });

// passport.deserializeUser(function(obj, callback) {
//     callback(null, obj);
// });

app.set("view engine", "pug");
app.set('views', path.join(__dirname, '../app/views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'whatever', resave: true, saveUninitialized: true }));

app.use(express.static(path.join(__dirname, '../app/public')));
app.use("/base", express.static(path.resolve(process.env.APPDATA + "/InfinityApp/")));

app.get('/', async function(req, res) {
    res.render('index');
});

// app.get('/auth/twitter/login', passport.authenticate('twitter'));

// app.get('/auth/twitter/callback', passport.authenticate('twitter', {
//     failureRedirect: '/'
// }), function(req, res) {
//     res.redirect('/')
// });

try {
    server.listen(35964, function() {
        console.log(`[host] http://localhost:${server.address().port}/ is online!`);
    });
} catch (err) {
    console.log("[host] Falha ao abrir a interface web do InfinityApp");
}

module.exports = { app: app, port: server.address().port };