var express = require('express');
var app = express();
var session = require("express-session");
var path = require('path');
var request = require('request');
var pug = require('pug');
var config = require('./config.json');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var OAuth2Strategy = require('passport-oauth2');
var CookieStrategy = require("passport-cookie");
var DiscordStrategy = require('passport-discord').Strategy;
var TwitterStrategy = require('passport-twitter');
var GithubStrategy = require('passport-github');
var SpotifyStrategy = require('passport-spotify').Strategy;
var SteamStrategy = require('passport-steam');
var YoutubeStrategy = require('passport-youtube-v3').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var http = require('http').Server(app);
<<<<<<< HEAD
// var Server = require('./Server');
var scopes = ['connections', 'identify', 'guilds'];
=======
var Server = require('./Server');
>>>>>>> a3d3bfa648fd2ad207e753cd4637fa05e1704fa9

const isDev = require('electron-is-dev'); // this is required to check if the app is running in development mode. 

//===============PASSPORT=================

<<<<<<< HEAD
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// login

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }
));

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
    clientID: config.discord.clientID,
    clientSecret: config.discord.clientSecret,
    callbackURL: 'http://localhost:8000/discord/auth/callback',
    scope: scopes
}, function(req, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));

// Twitter
passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: "http://localhost:8000/twitter/auth/callback"
}, function(token, tokenSecret, profile, done) {
    // NOTA: Voce tera, provavelmente, que associar o usuario do Twitter
    //       com um registro do usuario no seu banco de dados.
    var user = profile;
    return done(null, user);
}));
=======
>>>>>>> a3d3bfa648fd2ad207e753cd4637fa05e1704fa9

//===============EXPRESS=================

// view engine setup
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'pug');
<<<<<<< HEAD

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(session({
    secret: 'adobo the cato',
    cookie: { maxAge: 4800000000 },
    rolling: true,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/img', express.static(path.join(__dirname, '/app/public/img')));
app.use('/js', express.static(path.join(__dirname, '/app/public/js')));
app.use('/css', express.static(path.join(__dirname, '/app/public/css')));

app.get('/', checkAuth, function(req, res) {
    if (isDev) {
        res.render("index", {
            username: 'xDeltaFox',
            avatarURL: null
        });
    } else {
        let USR = req.user;
        console.log(USR);
        console.log(USR.photos[0].value);

        switch (USR.provider) {
            case 'twitter':
                res.render("index", {
                    username: USR.username,
                    avatarURL: USR.photos[0].value
                });
                break;
            case 'discord':
                res.render("index", {
                    username: `${USR.username}#${USR.discriminator}`,
                    avatarURL: `https://cdn.discordapp.com/avatars/${USR.id}/${USR.avatar}.png`
                });
                break;
            default:
                break;
        }
    }
});
=======
app.use(cookieParser());
app.use('/img', express.static(path.join(__dirname, '/app/public/img')));
app.use('/js', express.static(path.join(__dirname, '/app/public/js')));
app.use('/css', express.static(path.join(__dirname, '/app/public/css')));
>>>>>>> a3d3bfa648fd2ad207e753cd4637fa05e1704fa9

app.get('/login', function(req, res, next) {
    res.render("login");
});

<<<<<<< HEAD
app.get('/register', function(req, res, next) {
    res.render("register");
});

// Auth Discord
app.get('/discord', function(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.redirect('/discord/auth')
});
app.get('/discord/auth', passport.authenticate('discord', { scope: scopes }), function(req, res) {});
app.get('/discord/auth/callback', passport.authenticate('discord', { successReturnToOrRedirect: '/', failureRedirect: '/err' }));

// Auth Twitter
app.get('/twitter', function(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.redirect('/twitter/auth')
});
app.get('/twitter/auth', passport.authenticate('twitter'));
app.get('/twitter/auth/callback', passport.authenticate('twitter', { successReturnToOrRedirect: '/', failureRedirect: '/err' }));

app.get('/logout', (req, res) => {
    if (req.cookies.session) {
        res.clearCookie('session');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

app.get('/err', function(req, res) {
    res.redirect('/');
});

=======
>>>>>>> a3d3bfa648fd2ad207e753cd4637fa05e1704fa9
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