'use strict';

//--------------------------------------------
//--------------VARIABLES---------------------
//--------------------------------------------

const {
    app,
    BrowserWindow,
    clipboard,
    Cookies,
    crashReporter,
    desktopCapturer,
    remote,
    shell
} = require('electron');

var request = require('request');
var iconExtractor = require('icon-extractor');
var fs = require('fs');
var path = require('path');


var drag = false;
var barProgress = document.getElementsByClassName('player-progress-bar')[0];
var videoLoader = document.getElementById('progress-loader');
var progress = document.getElementsByClassName('progress-bar')[0];
var slider = document.getElementsByClassName('ply-mute-button')[0];
var sliderVol = document.getElementsByClassName('ply-volume-slider-handle')[0];

//--------------------------------------------
//--------------FUNCTIONS---------------------
//--------------------------------------------

function minimize() {
    var window = remote.getCurrentWindow();
    window.minimize();
}

function maximize() {
    var window = remote.getCurrentWindow();
    console.log(window.isMaximized());
    if (window.isMaximized()) {
        window.restore();
    } else {
        window.maximize();
    }
}

function close() {
    var window = remote.getCurrentWindow();
    window.isVisible() ? window.hide() : window.show()
}

function auth(arg) {
    console.log(arg)
    switch (arg) {
        case 'twitter':
            shell.openExternal('http://localhost:8000/twitter');
            console.log('OK!');
            break;
        case 'discord':
            shell.openExternal('http://localhost:8000/discord');
            console.log('OK!');
            break;
        default:
            break;
    }
}

function format(seconds) {
    function pad(s) {
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor(seconds % (60 * 60) / 60);
    var seconds = Math.floor(seconds % 60);

    if (hours > 0) {
        return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
    } else {
        return pad(minutes) + ':' + pad(seconds);
    }
}

/// Game selector

iconExtractor.emitter.on('icon', function(data) {
    console.log('Here is my context: ' + data.Context);
    console.log('Here is the path it was for: ' + data.Path);
    var folder_path = './app/public/img/games/';
    var image_path = `./app/public/img/games/${data.Context}_icon.png`;
    var icon = data.Base64ImageData;

    if (!fs.existsSync(image_path)) {
        fs.writeFile(image_path, icon, 'base64', (err) => {
            console.log(err);
        });
    }
});

var fileTypes = [
    'application/x-msdownload',
]

var input = document.getElementById('game_exe');
var preview = document.querySelector('.preview');

function validFileType(file) {
    for (var i = 0; i < fileTypes.length; i++) {
        console.log(file.type)
        if (file.type === fileTypes[i]) {
            return true;
        }
    }

    return false;
}

function returnFileSize(number) {
    if (number < 1024) {
        return number + 'bytes';
    } else if (number > 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + 'KB';
    } else if (number > 1048576) {
        return (number / 1048576).toFixed(1) + 'MB';
    }
}

function updateImageDisplay() {
    while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }

    var curFiles = input.files;
    if (curFiles.length === 0) {
        var para = document.createElement('p');
        para.textContent = 'No files currently selected for upload';
        preview.appendChild(para);
    } else {
        var list = document.createElement('ol');
        preview.appendChild(list);
        for (var i = 0; i < curFiles.length; i++) {
            var listItem = document.createElement('li');
            var para = document.createElement('p');
            if (validFileType(curFiles[i])) {
                // console.log(curFiles[i]);
                para.textContent = 'File name ' + curFiles[i].name + ', file size ' + returnFileSize(curFiles[i].size) + '.';
                iconExtractor.getIcon(curFiles[i].name, curFiles[i].path);
                var image = document.createElement('img');
                image.src = `./img/games/${curFiles[i].name}_icon.png`;

                listItem.appendChild(image);
                listItem.appendChild(para);
            } else {
                para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
                listItem.appendChild(para);
            }

            list.appendChild(listItem);
        }
    }
}

input.addEventListener('change', updateImageDisplay);


/// Playlist

var URL = window.URL || window.webkitURL;
var videoNode = document.getElementById('pb-video');
var BPlay = $('.ply-play-button .ply-svg-fill');
var playlist = [];

var playSelectedFile = function(event) {
    var file = this.files[0];
    var type = file.type;
    var canPlay = videoNode.canPlayType(type);
    if (canPlay === '') canPlay = 'no';
    var message = 'Can play type "' + type + '": ' + canPlay;
    var isError = canPlay === 'no';

    if (isError) {
        return;
    }

    console.log(file);

    playlist.push({
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        path: file.path,
        size: file.size,
        type: file.type,
        buffer: file
    });

    $('.list-itens-playlist').append(`
    <div class=""></div>
    `);

    var fileURL = URL.createObjectURL(file);
    videoNode.src = fileURL;
}
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