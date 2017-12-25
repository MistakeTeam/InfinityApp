'use strict';

var URL = window.URL || window.webkitURL;
var videoNode = document.getElementById('pb-video');
var BPlay = $('.ply-play-button .ply-svg-fill');
var playlist = [];
var itematual = 0;
var hasItem = false;
var drag = false;
var barProgress = document.getElementsByClassName('player-progress-bar')[0];
var videoLoader = document.getElementById('progress-loader');
var progress = document.getElementsByClassName('progress-bar')[0];
var slider = document.getElementsByClassName('ply-mute-button')[0];
var sliderVol = document.getElementsByClassName('ply-volume-slider-handle')[0];
var path = require('path');
var fs = require('fs');
var eventEmitter;
var File;

try {
    eventEmitter = require(path.resolve('./lib/events.js')).eventEmitter;
    File = require(path.resolve(process.cwd(), './lib/File.js'));
} catch (err) {
    eventEmitter = require(path.resolve(process.cwd(), './resources/app/lib/events.js')).eventEmitter;
    File = require(path.resolve(process.cwd(), './resources/app/lib/File.js'));
}

// console.log(fs.readdirSync(process.env.APPDATA + '/InfinityApp'))
var playSelectedFile = function(event) {
    console.log(this.files);
    for (var i = 0; i < this.files.length; i++) {
        hasItem = false;
        var file = this.files[i];
        var type = file.type;
        var canPlay = videoNode.canPlayType(type);
        if (canPlay === '') canPlay = 'no';
        var message = 'Can play type "' + type + '": ' + canPlay;
        var isError = canPlay === 'no';

        if (isError) {
            return;
        }

        console.log(file);

        playlist.forEach(play => {
            if (play.name == file.name) {
                return hasItem = true;
            }
        });

        if (!hasItem) {
            playlist.push({
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate,
                name: file.name,
                path: file.path,
                size: file.size,
                type: file.type,
                duration: 0,
                buffer: file
            });
            console.log(playlist);
        }
    }
    updatePlaylist();
    updatePlay(itematual);
}

function updatePlay(index) {
    var fileURL = URL.createObjectURL(playlist[index].buffer);
    console.log(`Tocando ${playlist[index].name}`);
    BPlay.attr('d', 'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z');
    $('.list-itens-playlist').children().removeClass('now-playing');
    $('.list-itens-playlist').children()[index].classList.add('now-playing');
    videoNode.src = fileURL;
}

function updatePlaylist() {
    $('.list-itens-playlist').children().remove();

    playlist.forEach((play, index) => {
        $('.list-itens-playlist').append(`
        <div class="cordilheia-item-playlist" index-play="${index}">
            <span>${index + 1}. </span>
            <span style="height: 20px; min-width: 200px; overflow: hidden;">${play.name}</span>
            <span>--:--</span>
        </div>
        `);
    });

    $('.player-T1ow86>.is-overlay').css('opacity', '0');
    $('.player-playlist').css('opacity', '0');
    $('.player-playlist').css('transform', 'scale(0.9, 0.9)');
    $('.player-playlist').css('z-index', '-1');

    setTimeout(() => {
        $('.player-T1ow86>.is-overlay').css('display', 'none');
        $('.player-playlist').css('display', 'none');
    }, 600);
}

$('#playlist-open-y40so9').click(function() {
    $('.player-T1ow86>.is-overlay').css('display', 'block');
    $('.player-playlist').css('display', 'block');

    setTimeout(() => {
        $('.player-T1ow86>.is-overlay').css('opacity', '0.85');
        $('.player-playlist').css('opacity', '1');
        $('.player-playlist').css('transform', 'scale(1.1, 1.1)');
        $('.player-playlist').css('z-index', '10');
    }, 1);
});

$('#over-Rtj493').click(function() {
    $('.player-T1ow86>.is-overlay').css('opacity', '0');
    $('.player-playlist').css('opacity', '0');
    $('.player-playlist').css('transform', 'scale(0.9, 0.9)');
    $('.player-playlist').css('z-index', '-1');

    setTimeout(() => {
        $('.player-T1ow86>.is-overlay').css('display', 'none');
        $('.player-playlist').css('display', 'none');
    }, 600);
});

$('#close-o69J50').click(function() {
    $('.player-T1ow86>.is-overlay').css('opacity', '0');
    $('.player-playlist').css('opacity', '0');
    $('.player-playlist').css('transform', 'scale(0.9, 0.9)');
    $('.player-playlist').css('z-index', '-1');

    setTimeout(() => {
        $('.player-T1ow86>.is-overlay').css('display', 'none');
        $('.player-playlist').css('display', 'none');
    }, 600);
});

function eventNextItem() {
    if (playlist[itematual + 1] != undefined) {
        itematual++;
        console.log('Item anterior da lista.');
        updatePlay(itematual);
    }
}

function eventPreviousItem() {
    if (playlist[itematual - 1] != undefined) {
        itematual--;
        console.log('Proximo item da lista.');
        updatePlay(itematual);
    }
}

eventEmitter.on('nextitem', eventNextItem);
$('.ply-next-button').click(eventNextItem);
$('.ply-previous-button').click(function() {
    console.log(videoNode.currentTime);
    if (videoNode.currentTime < 1) {
        eventPreviousItem();
    } else {
        videoNode.currentTime = 0;
    }
});
$('.cordilheia-item-playlist').click(function() {
    updatePlay($(this).attr('index-play'));
});

var inputNode = document.getElementById('pb-input');
inputNode.addEventListener('change', playSelectedFile, false);

function play_video() {
    if (videoNode.played.length != 0) {
        if (videoNode.played.start(0) == 0 && !videoNode.paused) {
            videoNode.pause();
            BPlay.attr('d', 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z');
        } else {
            videoNode.play();
            BPlay.attr('d', 'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z');
        }
    }
}

function update() {
    var duration = document.getElementById('ply-time-duration');
    var current = document.getElementById('ply-time-current');
    var pctSeek = (videoNode.currentTime / videoNode.duration) * 100;

    if (!videoNode.paused) {
        videoLoader.style.width = String(pctSeek) + '%';
        current.innerHTML = format(videoNode.currentTime);
        duration.innerHTML = format(videoNode.duration);
    }

    if (videoNode.currentTime == videoNode.duration) {
        eventEmitter.emit('nextitem');
    }

    // if(videoNode.currentTime == videoNode.duration) {
    //   img.src = "img/replay.png";
    // }
}

setInterval(function() { update(); }, 500);

$('.ply-mute-button').click(function(event) {
    if (!videoNode.muted) {
        videoNode.muted = true;
        videoNode.volume = 0;
        sliderVol.style.width = 0 + "%";
        // audioButton.querySelector('span').className = 'ion-volume-mute';
    } else {
        videoNode.muted = false;
        // audioButton.querySelector('span').className = 'ion-volume-medium';
        videoNode.volume = 0.9;
        sliderVol.style.width = 90 + "%";
    }
});

$('.ply-volume-panel').on('mousedown mouseup', function(event) {
    if (event.type == "mousedown") {
        drag = true;
    } else {
        drag = false;
    }
});

$('.ply-volume-panel').on('mousemove', function(event) {
    if (drag) {
        var w = slider.clientHeight - 2;
        var x = event.clientY - slider.offsetLeft;
        var pctVol = x / w;
        console.log(w, x, pctVol, videoNode.volume);

        if (pctVol > 1) {
            sliderVol.style.width = 100 + "%";
            videoNode.volume = 1;
        } else if (pctVol < 0) {
            sliderVol.style.width = 0 + "%";
            videoNode.volume = 0;
        } else {
            sliderVol.style.width = (x / w) * 100 + "%";
            videoNode.volume = pctVol;
        }
    } else {}
});

$('.player-progress-bar').click(function(event) {
    var pctBar = (event.clientX / barProgress.clientWidth) * 100;
    videoNode.currentTime = (videoNode.duration * pctBar) / 100;
});