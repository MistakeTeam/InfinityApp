var express = require('express');
var app = express();
var router = express.Router();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var gear = require('./DB/index.js');
// var DB = gear.DB;
// var guildDB = gear.guildDB;
// var userDB = gear.userDB;

var clients = {};

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// router.route('/guild/:id')
//     .post(function(req, res) {

//     })
//     .get(function(req, res) {
//         res.send(guildDB.get(req.params.id) || {});
//     })
//     .put(function(req, res) {
//         gear.dataDefine(guildDB, req.params.id, "Today", new Date());
//     });

// router.route('/user/:id')
//     .post(function(req, res) {

//     })
//     .get(function(req, res) {
//         res.send(userDB.get(req.params.id) || {});
//     })
//     .put(function(req, res) {
//         gear.dataDefine(userDB, req.params.id, "Today", new Date());
//     });

app.use('/api', router);

io.on("connection", function(client) {
    client.on("join", function(name) {
        console.log("Joined: " + name);
        var data = {
            "username": name,
            "status": "online",
            "game": {
                "name": "League of Legends"
            },
            "avatar_url": "https://cdn.discordapp.com/avatars/326164706664644609/d3ddfd32bdf64f953255ad01a989e7a5.jpg",
            "avatar": "d3ddfd32bdf64f953255ad01a989e7a5",
            "discriminator": "8919",
            "id": client.id
        }
        client.emit("update", "You have connected to the server.");
        client.broadcast.emit("update", name + " has joined the server.");
        clients += data;
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
    http.listen(3000, function() {
        console.log("Servidor rodando no http://localhost:3000/");
    });
} catch (err) {
    console.log("Falha ao abrir o servidor do InfinityApp");
}

module.exports = {
    io: io
}