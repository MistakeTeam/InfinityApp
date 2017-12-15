var express = require('express');
var app = express();
var session = require("express-session");
var path = require('path');
var request = require('request');
var pug = require('pug');
var fs = require('fs');
// var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

//Passpot
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

//Cache
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var http = require('http').Server(app);
// var Server = require('./Server');
var scopes = ['connections', 'identify', 'guilds'];
var File = require('./File.js');
var isDev = require('electron-is-dev'); // this is required to check if the app is running in development mode. 
const log = require("fancy-log");

//===============PASSPORT=================

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// login

// passport.use(new LocalStrategy(
//     function(username, password, done) {
//         User.getUserByUsername(username, function(err, user) {
//             if (err) throw err;
//             if (!user) {
//                 return done(null, false, { message: 'Unknown User' });
//             }

//             User.comparePassword(password, user.password, function(err, isMatch) {
//                 if (err) throw err;
//                 if (isMatch) {
//                     return done(null, user);
//                 } else {
//                     return done(null, false, { message: 'Invalid password' });
//                 }
//             });
//         });
//     }
// ));

// passport.use(new CookieStrategy(
//     function(token, done) {
//         User.findByToken({
//             token: token
//         }, function(err, user) {
//             if (err) {
//                 return done(err);
//             }
//             if (!user) {
//                 return done(null, false);
//             }
//             return done(null, user);
//         });
//     }
// ));

// // Discord
// passport.use(new DiscordStrategy({
//     clientID: config.discord.clientID,
//     clientSecret: config.discord.clientSecret,
//     callbackURL: 'http://localhost:8000/discord/auth/callback',
//     scope: scopes
// }, function(req, accessToken, refreshToken, profile, done) {
//     process.nextTick(function() {
//         return done(null, profile);
//     });
// }));

// // Twitter
// passport.use(new TwitterStrategy({
//     consumerKey: config.twitter.consumerKey,
//     consumerSecret: config.twitter.consumerSecret,
//     callbackURL: "http://localhost:8000/twitter/auth/callback"
// }, function(token, tokenSecret, profile, done) {
//     // NOTA: Voce tera, provavelmente, que associar o usuario do Twitter
//     //       com um registro do usuario no seu banco de dados.
//     var user = profile;
//     return done(null, user);
// }));

//===============EXPRESS=================

// view engine setup
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'pug');

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

app.use(express.static(path.join(__dirname, 'public')));
app.use("/base", express.static(path.resolve(process.env.APPDATA + "/InfinityApp/")));

app.get('/', function(req, res) {
    console.log('Bem-vindo!!');
    File.ReadFile('gamesDB.json', data => {
        var filesave = JSON.parse(data);
        console.log(filesave);

        res.render("index", {
            games: filesave.games
        });
    });

    // if (isDev) {
    //     File.ReadFile('gamesDB.json', data => {
    //         var filesave = JSON.parse(data);

    //         res.render("index", {
    //             games: filesave.games
    //         });
    //     });
    // } else {
    //     let USR = req.user;
    //     log.info(USR);
    //     log.info(USR.photos[0].value);

    //     File.ReadFile('gamesDB.json', data => {
    //         var filesave = JSON.parse(data);

    //         if (USR) {
    //             switch (USR.provider) {
    //                 case 'twitter':
    //                     res.render("index", {
    //                         profile_data: {
    //                             username: USR.username,
    //                             avatarURL: USR.photos[0].value,
    //                         },
    //                         games: filesave.games
    //                     });
    //                     break;
    //                 case 'discord':
    //                     res.render("index", {
    //                         profile_data: {
    //                             username: `${USR.username}#${USR.discriminator}`,
    //                             avatarURL: `https://cdn.discordapp.com/avatars/${USR.id}/${USR.avatar}.png`
    //                         },
    //                         games: filesave.games
    //                     });
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         } else {
    //             res.render("index", {
    //                 username: 'User',
    //                 avatarURL: null,
    //                 games: filesave.games
    //             });
    //         }
    //     });
    // }
});
app.use(cookieParser());
app.use('/img', express.static(path.join(__dirname, '/app/public/img')));
app.use('/js', express.static(path.join(__dirname, '/app/public/js')));
app.use('/css', express.static(path.join(__dirname, '/app/public/css')));

app.get('/login', function(req, res, next) {
    res.render("login");
});

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