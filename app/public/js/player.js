'use strict';

var URL = window.URL || window.webkitURL,
    videoNode = document.getElementById('pb-video'),
    BPlay = $('.ply-play-button .ply-svg-fill'),
    playlist = [],
    indexlivre = 0,
    itematual = 0,
    hasItem = false,
    isPlay = false,
    nextVideo = false,
    previousVideo = false,
    drag = false,
    barProgress = document.getElementsByClassName('player-progress-bar')[0],
    videoLoader = document.getElementById('progress-loader'),
    progress = document.getElementsByClassName('progress-bar')[0],
    slider = document.getElementsByClassName('ply-mute-button')[0],
    sliderVol = document.getElementsByClassName('ply-volume-slider-handle')[0],
    path = require('path'),
    fs = require('fs'),
    eventEmitter,
    File;

try {
    eventEmitter = require(path.resolve('./lib/events.js')).eventEmitter;
    File = require(path.resolve(process.cwd(), './lib/File.js'));
} catch (err) {
    eventEmitter = require(path.resolve(process.cwd(), './resources/app.asar/lib/events.js')).eventEmitter;
    File = require(path.resolve(process.cwd(), './resources/app.asar/lib/File.js'));
}

var playSelectedFile = function(event) {
    for (var i = 0; i < this.files.length; i++) {
        hasItem = false;
        var file = this.files[i];
        var type = file.type;
        var canPlay = videoNode.canPlayType(type) ? videoNode.canPlayType(type) : 'no';

        if (canPlay === 'no') {
            return;
        }

        playlist.forEach(play => {
            if (play.name == file.name) {
                return hasItem = true;
            }
        });

        if (!hasItem) {
            $('.player-video').append('<video id="getduration" src="" autoplay style="display:none;"></video>');
            var tstehdj = document.getElementById('getduration');
            tstehdj.muted = true;
            tstehdj.src = URL.createObjectURL(file);
            console.log($('#getduration'));
            var videoadd = {
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate,
                name: file.name,
                path: file.path,
                size: file.size,
                type: file.type,
                duration: $('#getduration')[0].duration,
                buffer: file
            };
            playlist.push(videoadd);
            indexlivre = playlist.indexOf(videoadd);
            videoadd = null;
            tstehdj = null;
            $('#getduration').remove();
        }
    }
    updatePlaylist();
    if (!isPlay) {
        updatePlay(indexlivre);
    }
}

function updatePlay(index) {
    var fileURL = URL.createObjectURL(playlist[index].buffer);
    itematual = indexlivre;
    if (nextVideo || previousVideo) {
        itematual = index;
    }
    console.log(`Tocando ${playlist[index].name}`);
    BPlay.attr('d', 'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z');
    $('.list-itens-playlist').children().removeClass('now-playing');
    $('.list-itens-playlist').children()[itematual].classList.add('now-playing');
    videoNode.src = fileURL;
    isPlay = true;
    nextVideo = false;
    previousVideo = false;
    fileURL = null;
}

function updatePlaylist() {
    $('.list-itens-playlist').children().remove();

    playlist.forEach((play, index) => {
        $('.list-itens-playlist').append(`
        <div class="cordilheia-item-playlist" index-play="${index}">
            <span>${index + 1}. </span>
            <div style="display: inline-flex;">
                <span style="width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${play.name}">${play.name}</span>
            </div>
            <span>${play.duration}</span>
        </div>
        `);
    });

    $('.list-itens-playlist').children().removeClass('now-playing');
    $('.list-itens-playlist').children()[itematual].classList.add('now-playing');

    $('.player-T1ow86>.is-overlay').css('opacity', '0');
    $('.player-playlist').css('width', '0px');
    $('.player-playlist').css('z-index', '-1');

    setTimeout(() => {
        $('.player-T1ow86>.is-overlay').css('display', 'none');
        $('.player-playlist').css('display', 'none');
    }, 600);
}

$('.cordilheia-item-playlist').click(function() {
    updatePlay($(this).attr('index-play'));
})

$('#playlist-open-y40so9').click(function() {
    $('.player-T1ow86>.is-overlay').css('display', 'block');
    $('.player-playlist').css('display', 'block');

    setTimeout(() => {
        $('.player-T1ow86>.is-overlay').css('opacity', '0.85');
        $('.player-playlist').css('width', '400px');
        $('.player-playlist').css('z-index', '10');
    }, 1);
});

$('#over-Rtj493').click(function() {
    $('.player-T1ow86>.is-overlay').css('opacity', '0');
    $('.player-playlist').css('width', '0px');
    $('.player-playlist').css('z-index', '-1');

    setTimeout(() => {
        $('.player-T1ow86>.is-overlay').css('display', 'none');
        $('.player-playlist').css('display', 'none');
    }, 600);
});

function eventNextItem() {
    if (playlist[itematual + 1] != undefined) {
        nextVideo = true;
        itematual++;
        console.log('Proximo item da lista.');
        updatePlay(itematual);
    }
}

function eventPreviousItem() {
    if (playlist[itematual - 1] != undefined) {
        previousVideo = true;
        itematual--;
        console.log('Item anterior da lista.');
        updatePlay(itematual);
    }
}

eventEmitter.on('nextitem', eventNextItem);
$('.ply-next-button').click(eventNextItem);
$('.ply-previous-button').click(function() {
    if (videoNode.currentTime <= 1) {
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
            // isPlay = false;
            videoNode.pause();
            BPlay.attr('d', 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z');
        } else {
            // isPlay = true;
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

$('.ply-volume-panel')
    .on('mousedown mouseup', function(event) {
        if (event.type == "mousedown") {
            drag = true;
        } else {
            drag = false;
        }
    })
    .on('mousemove', function(event) {
        if (drag) {
            var w = slider.clientHeight - 2;
            var x = event.clientY - slider.offsetLeft;
            var pctVol = x / w;

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

$('.player-progress-bar').mousedown(function(event) {
    var pctBar = (event.clientX / barProgress.clientWidth) * 100;
    videoNode.currentTime = (videoNode.duration * pctBar) / 100;
});

$('.player-video')
    .mouseover(function(event) {
        $('.player-controls-botton').css('opacity', '1');
    })
    .mouseout(function(event) {
        $('.player-controls-botton').css('opacity', '0');
    });

$('.player-controls-botton')
    .mouseover(function(event) {
        $('.player-controls-botton').css('opacity', '1');
    })
    .mouseout(function(event) {
        $('.player-controls-botton').css('opacity', '0');
    });