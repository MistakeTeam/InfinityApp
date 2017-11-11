var express = require('express');
var app = express();
var session = require("express-session");
var path = require('path');
var request = require('request');
var passport = require('passport');
var CookieStrategy = require("passport-cookie");
var DiscordStrategy = require('passport-discord').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var http = require('http').Server(app);

var scopes = ['connections', 'identify', 'guilds'];

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new CookieStrategy(
    function(token, done) {
        User.findByToken({
            token: token
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

// Discord
passport.use(new DiscordStrategy({
    clientID: '361264763440726021',
    clientSecret: 'EgUXRZE7s6lriyzfz_sd7nAacyNtbuKw',
    callbackURL: 'http://localhost:8000/discord/auth/callback',
    scope: scopes
}, function(req, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(session({
    secret: 'adobo the cato',
    cookie: { maxAge: 36000000 },
    rolling: true,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
    res.send("login");
});

app.get('/dash', checkAuth, function(req, res) {
    let USR = req.user;
    // console.log(USR);
    console.log(req);

    res.json(USR || {});
});

app.get('/login', function(req, res, next) {
    console.log(req.cookies);
    res.send("login");
});

// Auth Discord
app.get('/discord', function(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.redirect('/discord/auth')
});
app.get('/discord/auth', passport.authenticate('discord', { scope: scopes }), function(req, res) {});
app.get('/discord/auth/callback', passport.authenticate('discord', { failureRedirect: '/err' }), function(req, res) {
    res.redirect('/dash'); // auth success
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 404);
    res.send('error');
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.redirect('/');
    //res.send('not logged in :(');
}

try {
    http.listen(8000, function() {
        console.log("http://localhost:8000/");
    });
} catch (err) {
    console.log("Falha ao abrir a interface web do InfinityApp");
}