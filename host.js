var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var pug = require('pug');
var cookieParser = require('cookie-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};

const isDev = require('electron-is-dev'); // this is required to check if the app is running in development mode. 
const { appUpdater } = require('./appUpdate.js');

app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'pug');
app.use(cookieParser());
app.use('/img', express.static(path.join(__dirname, '/app/public/img')));
app.use('/js', express.static(path.join(__dirname, '/app/public/js')));
app.use('/css', express.static(path.join(__dirname, '/app/public/css')));

app.get('/', function(req, res) {
    res.render("index", {
        itemname3: "res",
        onUpdate: function() {
            const checkOS = isWindowsOrmacOS();
            if (checkOS && !isDev) {
                // Initate auto-updates on macOs and windows
                appUpdater();
            }
        }
    });
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
    websocket: io,
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

io.on("connection", function(client) {
    client.on("join", function(name) {
        console.log("Joined: " + name);
        clients[client.id] = name;
        client.emit("update", "You have connected to the server.");
        client.broadcast.emit("update", name + " has joined the server.")
    });

    client.on("send", function(msg) {
        console.log("Message: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function() {
        console.log("Disconnect");
        io.emit("update", clients[client.id] + " has left the server.");
        delete clients[client.id];
    });
});

try {
    http.listen(8000, function() {
        console.log("http://localhost:8000/");
    });
} catch (err) {
    console.log("Falah ao abrir a interface web do InfinityApp");
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