const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const path = require('path');
const request = require('request');
const pug = require('pug');
const http = require('http').Server(app);
const File = require('./File.js');
const isDev = require('electron-is').dev();
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_SECRET = process.env.TWITCH_SECRET;

//===============EXPRESS=================

// view engine setup
app.set('views', path.join(__dirname, '../app/views'));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/../app/public'));
app.use("/base", express.static(path.resolve(process.env.APPDATA + "/InfinityApp/")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(cookieParser({
//     secret: 'abbalt to rolling',
//     maxAge: 86400000000
// }));
app.use(cookieParser());
app.use(session({
    secret: 'abbalt to rolling',
    rolling: true,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 86400000000 }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
    var options = {
        url: 'https://api.twitch.tv/kraken/user',
        method: 'GET',
        headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Authorization': 'OAuth ' + accessToken
        }
    };

    request(options, function(error, response, body) {
        if (response && response.statusCode == 200) {
            done(null, body);
        } else {
            done(bodyh);
        }
    });
}

passport.use('twitch', new OAuth2Strategy({
        authorizationURL: 'https://api.twitch.tv/kraken/oauth2/authorize',
        tokenURL: 'https://api.twitch.tv/kraken/oauth2/token',
        clientID: TWITCH_CLIENT_ID,
        clientSecret: TWITCH_SECRET,
        callbackURL: '/auth/twitch/callback',
        state: true
    },
    function(accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;

        // Securely store user profile in your DB
        //User.findOrCreate(..., function(err, user) {
        //  done(err, user);
        //});

        done(null, profile);
    }
));

app.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read' }));
app.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/err' }));

app.get('/', function(req, res) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    if (req.user) {
        console.log('[host] Bem-vindo ao lar');
        res.render("index", {
            Twitch: req.user
        });
    } else {
        console.log('[host] Bem-vindo ao lar');
        res.render("index");
    }
});

app.get('/err', function(req, res) {
    res.redirect('/');
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.redirect('/auth')
}

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
        console.log("[host] http://localhost:8000/ is online!");
    });
} catch (err) {
    console.log("[host] Falha ao abrir a interface web do InfinityApp");
}