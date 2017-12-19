'use strict';

var iconExtractor = require('icon-extractor');
var path = require('path');
var fs = require('fs');
var child = require('child_process');
var File;

try {
    File = require(path.resolve(process.cwd(), './File.js'));
} catch (err) {
    File = require(path.resolve(process.cwd(), './resources/app/File.js'));
}

iconExtractor.emitter.on('icon', function(data) {
    console.log('Here is my context: ' + data.Context);
    console.log('Here is the path it was for: ' + data.Path);
    var folder_path = process.env.APPDATA + "/InfinityApp/games/";
    var image_path = process.env.APPDATA + `/InfinityApp/games/${data.Context}_icon.png`;
    var icon = data.Base64ImageData;

    if (!fs.existsSync(folder_path)) {
        fs.mkdirSync(folder_path);
        fs.chmodSync(folder_path, '777');
    }

    if (!fs.existsSync(image_path)) {
        fs.writeFile(image_path, icon, 'base64', (err) => {
            console.log(err);
        });
    }
});

var fileTypes = [
    'application/x-msdownload',
]

var preview = $('.preview');
var input = document.getElementById('game_exe');
var sep_data = {};

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

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
    if (preview.children()) {
        preview.children().remove();
    }

    var curFiles = input.files;
    if (curFiles.length === 0) {
        preview.append(`
            <p>No files currently selected for upload</p>
        `)
    } else {
        for (var i = 0; i < curFiles.length; i++) {
            if (validFileType(curFiles[i])) {
                iconExtractor.getIcon(curFiles[i].name, curFiles[i].path);

                preview.append(`
                    <p>Icon</p>
                    <img src="base/games/${curFiles[i].name}_icon.png"></img>
                `);
                $('#gamesText').children('input').val(curFiles[i].name.replace('.exe', ''));

                sep_data = {
                    "name": curFiles[i].name.replace('.exe', ''),
                    "description": "",
                    "path": curFiles[i].path,
                    "thumb": ""
                }
                console.log(sep_data);
            } else {
                preview.append(`
                    <p>File name ${curFiles[i].name}: Not a valid file type. Update your selection</p>
                `);
            }
        }
    }
}

input.addEventListener('change', updateImageDisplay);

$('#over-gi592n').click(function() {
    $('.games-H5wY75>.is-overlay').css('opacity', '0');
    $('.gameview-add').css('opacity', '0');
    $('.gameview-add').css('transform', 'scale(0.9, 0.9)');
    $('.gameview-add').css('z-index', '-1');

    setTimeout(() => {
        $('.games-H5wY75>.is-overlay').css('display', 'none');
        $('.gameview-add').css('display', 'none');
    }, 600);
});

$('#close-Th6o7p').click(function() {
    $('.games-H5wY75>.is-overlay').css('opacity', '0');
    $('.gameview-add').css('opacity', '0');
    $('.gameview-add').css('transform', 'scale(0.9, 0.9)');
    $('.gameview-add').css('z-index', '-1');

    setTimeout(() => {
        $('.games-H5wY75>.is-overlay').css('display', 'none');
        $('.gameview-add').css('display', 'none');
    }, 600);
});

$('.game-add-F58dY4').click(function() {
    $('.games-H5wY75>.is-overlay').css('display', 'block');
    $('.gameview-add').css('display', 'block');

    setTimeout(() => {
        $('.games-H5wY75>.is-overlay').css('opacity', '0.85');
        $('.gameview-add').css('opacity', '1');
        $('.gameview-add').css('transform', 'scale(1.1, 1.1)');
        $('.gameview-add').css('z-index', '10');
    }, 1);
});

$('.game-options-Ao1t71').click(function(events) {
    var path = $(this).parent().attr('path').split('\\');
    var Rpath = "";
    console.log(path);

    for (var i = 0; i < path.length - 1; i++) {
        Rpath += `${path[i]}\\`;
        console.log(Rpath);
    }
    process.chdir(Rpath);
    child.execFile(`./${path[path.length-1]}`, function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
})

$('.comfirm-Te2Y93').click(function() {
    File.ReadFile('gamesDB.json', db => {
        console.log(db);
        var data = JSON.parse(db);
        if (data.games == undefined) {
            data.games = [];
        }

        sep_data.name = $('#gamesText').children('input').val();
        sep_data.description = $('#gamesDesc').children('input').val();
        sep_data.thumb = $('#gamesThumb').children('input').val();

        data.games.push(sep_data);
        console.log(sep_data);
        sep_data = {};
        console.log(data);

        $('.game-item-T5e87d').remove();
        for (let i = 0; i < data.games.length; i++) {
            $('.games-H5wY75').append(`
            <div class="game-item-T5e87d" path="${data.games[i].path}">
                <img src="${data.games[i].thumb}", alt=""></img>
                <div class="game-add-footer animation-default">
                    <span class="footer-title">${data.games[i].name}</span>
                    <span style='opacity: 0;' class="footer-descripition animation-default">${data.games[i].description}</span>
                </div>
                <div class="game-options-Ao1t71 animation-default">
                    <svg height="100%" version="1.1" viewBox="0 3 32 30" width="100%" style="fill: white;">
                        <use class="ytp-svg-shadow" xlink:href="#ytp-id-33"></use>
                        <path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-id-33"></path>
                    </svg>
                </div>
            </div>
            `);
        }

        File.SaveFile('gamesDB.json', JSON.stringify(data));
    });

    $('.games-H5wY75>.is-overlay').css('opacity', '0');
    $('.gameview-add').css('opacity', '0');
    $('.gameview-add').css('transform', 'scale(0.9, 0.9)');
    $('.gameview-add').css('z-index', '-1');

    setTimeout(() => {
        $('.games-H5wY75>.is-overlay').css('display', 'none');
        $('.gameview-add').css('display', 'none');
    }, 600);
});