var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var pug = require('pug');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var cookieParser = require('cookie-parser');
var http = require('http').Server(app);
var Server = require('./Server');
var sassMiddleware = require('node-sass-middleware');

const isDev = require('electron-is-dev'); // this is required to check if the app is running in development mode. 
const { appUpdater } = require('./appUpdate.js');

//===============PASSPORT=================

// Passport session setup.
passport.serializeUser(function(user, done) {
    console.log("serializing " + user.username);
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log("deserializing " + obj);
    done(null, obj);
});

// Use the LocalStrategy within Passport to login users.
passport.use('local-signin', new LocalStrategy({ passReqToCallback: true }, //allows us to pass back the request to the callback
    function(req, username, password, done) {
        funct.localAuth(username, password)
            .then(function(user) {
                if (user) {
                    console.log("LOGGED IN AS: " + user.username);
                    req.session.success = 'You are successfully logged in ' + user.username + '!';
                    done(null, user);
                }
                if (!user) {
                    console.log("COULD NOT LOG IN");
                    req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
                    done(null, user);
                }
            })
            .fail(function(err) {
                console.log(err.body);
            });
    }
));

// Use the LocalStrategy within Passport to Register/"signup" users.
passport.use('local-signup', new LocalStrategy({ passReqToCallback: true }, //allows us to pass back the request to the callback
    function(req, username, password, done) {
        funct.localReg(username, password)
            .then(function(user) {
                if (user) {
                    console.log("REGISTERED: " + user.username);
                    req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
                    done(null, user);
                }
                if (!user) {
                    console.log("COULD NOT REGISTER");
                    req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
                    done(null, user);
                }
            })
            .fail(function(err) {
                console.log(err.body);
            });
    }
));

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.session.error = 'Please sign in!';
    res.redirect('/signin');
}


//===============EXPRESS=================

// Configure Express
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'pug');
app.use(cookieParser());
app.use('/img', express.static(path.join(__dirname, '/app/public/img')));
app.use('/js', express.static(path.join(__dirname, '/app/public/js')));
app.use('/css', express.static(path.join(__dirname, '/app/public/css')));
app.use('/sass', express.static(path.join(__dirname, '/app/public/sass')));
app.use(passport.initialize());
app.use(passport.session());

app.use(sassMiddleware({
    src: path.join(__dirname, 'public/sass'),
    dest: path.join(__dirname, 'public/css'),
    debug: true,
    outputStyle: 'compressed',
    prefix: '/css'
}));

app.use(sassMiddleware({
    src: path.join(__dirname, 'public/sass'),
    dest: path.join(__dirname, 'public/css'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
    prefix: '/css'
}));

app.use(function(req, res, next) {
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});

app.get('/', function(req, res) {
    res.render("index", {
        onUpdate: function() {
            const checkOS = isWindowsOrmacOS();
            if (checkOS && !isDev) {
                // Initate auto-updates on macOs and windows
                appUpdater();
            }
        }
    });
});

//displays our signup page
app.get('/signin', function(req, res) {
    res.render('signin');
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/local-reg', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signin'
}));

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/login', passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/signin'
}));

//logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', function(req, res) {
    var name = req.user.username;
    console.log("LOGGIN OUT " + req.user.username)
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been logged out " + name + "!";
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//Status
app.use(require('express-status-monitor')({
    title: 'Infinity Status',
    path: '/status',
    websocket: Server.io,
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

try {
    http.listen(8000, function() {
        console.log("http://localhost:8000/");
    });
} catch (err) {
    console.log("Falha ao abrir a interface web do InfinityApp");
}


//---------------------
//-------REQUEST-------
//---------------------

// request({
//         method: 'GET',
//         uri: 'http://localhost:8000/',
//         gzip: true
//     }, function(error, response, body) {
//         // body is the decompressed response body
//         console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
//         console.log('the decoded data is: ' + body)
//     })
//     .on('data', function(data) {
//         // decompressed data as it is received
//         console.log('decoded chunk: ' + data)
//     })
//     .on('response', function(response) {
//         // unmodified http.IncomingMessage object
//         response.on('data', function(data) {
//             // compressed data as it is received
//             console.log('received ' + data.length + ' bytes of compressed data')
//         })
//     })

// var headers = {
//     'User-Agent': 'Super Agent/0.0.1',
//     'Content-Type': 'application/json'
// }

// var options = {
//     url: 'http://localhost:8000/',
//     method: 'POST',
//     headers: headers,
//     json: { 'key1': 'xxx', 'key2': 'yyy' }
// }

// request(options, function(error, response, body) {
//     if (!error && response.statusCode == 200) {
//         // Print out the response body
//         console.log(body)
//     }
//     console.log(body)
// })

//---------------------
//-------REQUEST-------
//---------------------