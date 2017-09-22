$(document).ready(function() {
    var socket = io.connect("http://localhost:8000");
    var ready = false;

    var username = '';
    var password = '';

    $("#submit").on('click', function(e) {
        e.preventDefault();
        username = $("#nickname").val();
        password = $("#password").val();
        if (username && password) {
            $("#nick").fadeOut();
            // $("#chat").fadeIn();
            var time = new Date();
            $("#name").html(username);
            $("#time").html('First login: ' + time.getHours() + ':' + time.getMinutes());

            ready = true;
            socket.emit("join", username);
            setTimeout(function() {
                $('.login').remove();
            }, 2000);
        }
        if (!username) {
            $('.nickname_container').append('<span class="info-erro">Nome de Usuario não pode esta vazio</span>');
            setTimeout(function() {
                $('.info-erro')[0].remove();
            }, 5000);
            return;
        }
        if (!password) {
            $('.nickname_container').append('<span class="info-erro">Senha não pode esta vazio</span>');
            setTimeout(function() {
                $('.info-erro')[0].remove();
            }, 5000);
            return;
        }
    });

    socket.on("update", function(msg) {
        if (ready) {
            $('.chat').append('<div class="info">' + msg + '</div>')
        }
    });

    $("#textarea").keypress(function(e) {
        if (e.which == 13) {
            var text = $("#textarea").val();
            $("#textarea").val('');
            var time = new Date();
            $(".chat").append('<div class="self"><div class="msg"><span>' + username + ' ' + time.getHours() + ':' + time.getMinutes() + '</span><p>' + text + '</p></div></div>');
            socket.emit("send", text);
        }
    });

    socket.on("chat", function(client, msg) {
        if (ready) {
            var time = new Date();
            $(".chat").append('<div class="other"><div class="msg"><span>' + client + ' ' + time.getHours() + ':' + time.getMinutes() + '</span><p>' + msg + '</p></div></div>');
        }
    });
});