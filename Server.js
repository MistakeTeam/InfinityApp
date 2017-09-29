var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};

app.get('/api/', function(req, res) {
    res.send('{"code": 0, "message": "401: Unauthorized"}');
});

app.get('/api/users', function(req, res) {
    res.send(clients);
});

io.on("connection", function(client) {
    client.on("join", function(name) {
        console.log("Joined: " + name);
        var data = {
            id: client.id,
            username: name
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