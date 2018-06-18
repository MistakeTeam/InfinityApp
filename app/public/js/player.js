'use strict';

var URL = window.URL || window.webkitURL,
    videoNode = document.getElementById('pb-video'),
    BPlay = $('.ply-play-button'),
    playlist = [],
    itemlivre = 0,
    itematual = 0,
    hasItem = false,
    isPlay = false,
    nextVideo = false,
    previousVideo = false,
    selectVideo = false,
    ply_volume_panel_drag = false,
    player_progress_bar_click = false,
    resize_drag = false,
    barProgress = document.getElementsByClassName('player-progress-bar')[0],
    videoLoader = document.getElementById('progress-loader'),
    progress = document.getElementsByClassName('progress-bar')[0],
    slider = document.getElementsByClassName('ply-mute-button')[0],
    sliderVol = document.getElementsByClassName('ply-volume-slider-handle')[0];

var playSelectedFile = async function(event) {
    var fristitem = {};

    $('.list-itens-playlist').children().remove();
    $('.list-itens-playlist').append(`
    <div class="loading-init">
        <div class="typing-3eiiL_">
            <span class="ellipsis--nKTEd">
                <span class="spinner-inner spinner-pulsing-ellipsis">
                    <span class="spinner-item"></span>
                    <span class="spinner-item"></span>
                    <span class="spinner-item"></span>
                </span>
            </span>
        </div>
    </div>
    `);

    for (var i = 0; i < this.files.length; i++) {
        // if (i < 5) {
        hasItem = false;
        var file = this.files[i];
        var type = file.type;
        var canPlay = videoNode.canPlayType(type) ? videoNode.canPlayType(type) : 'no';

        if (canPlay === 'no') {
            return;
        }

        playlist.forEach(play => {
            if (play.name == file.name) {
                hasItem = true;
            }
        });

        if (!hasItem) {
            var dur = await getDuraction(file);
            var videoadd = {
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate,
                name: file.name,
                path: file.path,
                size: file.size,
                type: file.type,
                duration: dur,
                buffer: file
            };
            playlist.push(videoadd);
            if (i == 0) {
                fristitem = videoadd;
            }
            itemlivre = playlist.indexOf(videoadd);
            videoadd = null;
        }
        // }
    }
    setTimeout(() => {
        updatePlaylist();
        if (!isPlay) {
            if (this.files.length > 1) {
                itemlivre = playlist.indexOf(fristitem);
            }
            updatePlay(itemlivre);
        }
    }, 300);
}

function getDuraction(file) {
    return new Promise(async resolve => {
        if ($('#getduration').length == 0) {
            $('.player-video').append('<video id="getduration" src="" autoplay style="display:none;"></video>');
        }
        var videoPreload = document.getElementById('getduration');
        videoPreload.muted = true;
        videoPreload.preload = 'metadata';
        videoPreload.src = URL.createObjectURL(file);
        videoPreload.onloadedmetadata = await

        function(event) {
            URL.revokeObjectURL(videoPreload.src);
            resolve(videoPreload.duration);
            $('#getduration').remove();
            videoPreload = null;
            return;
        }
    });
}

function updatePlay(index) {
    var fileURL = URL.createObjectURL(playlist[index].buffer);
    itematual = new Number(itemlivre);
    console.log(fileURL);
    if (nextVideo || previousVideo || selectVideo) {
        itematual = new Number(index);
    }

    IAPI.init({
        state: 'Player',
        details: playlist[index].name,
        active: true
    });

    remote.getCurrentWindow().setTitle(`Player - ${playlist[index].name}`);
    console.log(`[player] Tocando ${playlist[index].name}`);

    BPlay.children().remove();
    BPlay.html(`<span><span class="fa fa-pause"></span></span>`);
    if ($('.list-itens-playlist').children('.cordilheia-item-playlist').length != 0) {
        $('.list-itens-playlist').children().removeClass('now-playing');
        $($('.list-itens-playlist').children()[itematual]).addClass('now-playing');
    }

    videoNode.src = fileURL;
    isPlay = true;
    nextVideo = false;
    previousVideo = false;
    selectVideo = false;
    fileURL = null;
}

function updatePlaylist() {
    $('.list-itens-playlist').children().remove();

    let totalDuration = 0;
    playlist.forEach((play, index) => {
        $('.list-itens-playlist').append(`
        <div class="cordilheia-item-playlist" index-play="${index}">
            <span style="text-overflow: ellipsis;white-space: nowrap;overflow: auto;" title="${play.name}">${play.name}</span>
            <span>${format(play.duration)}</span>
        </div>
        `);
        totalDuration += play.duration;
    });

    $('.cordilheia-item-playlist').mouseup(function(event) {
        switch (event.which) {
            case 1:
                console.log('Left Mouse button pressed.');
                selectVideo = true;
                updatePlay($(this).attr('index-play'));
                setTimeout(() => {
                    updatePlaylist();
                }, 20);
                break;
            case 3:
                console.log('Right Mouse button pressed.');
                if ($('#right-mouse-options').length == 0) {
                    $('.downmost').append(`<div id="right-mouse-options" style="left: auto; right: auto; bottom: auto; top: auto;"></div>`);
                } else if ($('#right-mouse-options').length > 0) {
                    if ($('#right-mouse-options').children().length > 0) {
                        $('#right-mouse-options').children().remove();
                    }
                }

                let item_playlist = $(this);
                let lite = [{
                    id: "remove-item-playlist",
                    text: "Remover",
                    generator: function() {
                        console.log(`Removendo ${playlist[item_playlist.attr('index-play')].name}`);
                        if (itematual == item_playlist.attr('index-play')) {
                            if (playlist[itematual + 1] != undefined) {
                                // nextVideo = true;
                                // itematual++;
                                console.log('[player] Proximo item da lista.');
                                updatePlay(itematual + 1);
                            } else {
                                videoNode.src = undefined;
                                isPlay = false;
                                remote.getCurrentWindow().setTitle(`Player`);
                                IAPI.init({
                                    state: 'Player',
                                    active: false
                                });
                            }
                        } else if (itematual > item_playlist.attr('index-play')) {
                            itematual--;
                        }

                        playlist.splice(item_playlist.attr('index-play'), 1);
                        setTimeout(() => {
                            updatePlaylist();
                        }, 20);
                        $('#right-mouse-options').remove();
                    }
                }];
                CLOSE_MENU = true;
                lite.forEach((value, index, array) => {
                    $('#right-mouse-options').append(`<div class="options-item" id="${value.id}"><span>${value.text}</span></div>`);
                    $(`#${value.id}`).click(value.generator);
                });

                if ($('#right-mouse-options').children().length > 0) {
                    if ((event.clientX + $('#right-mouse-options').outerWidth(true)) > ($('#document-body').width() - 35)) {
                        let result = 35;
                        $('#right-mouse-options').css('left', `auto`);
                        $('#right-mouse-options').css('right', `${result}px`);
                    } else {
                        $('#right-mouse-options').css('left', `${event.clientX}px`);
                        $('#right-mouse-options').css('right', `auto`);
                    }
                    if ((event.clientY + $('#right-mouse-options').outerHeight(true)) > $('#document-body').height()) {
                        let result = 0;
                        $('#right-mouse-options').css('bottom', `${result}px`);
                        $('#right-mouse-options').css('top', `auto`);
                    } else {
                        $('#right-mouse-options').css('bottom', `auto`);
                        $('#right-mouse-options').css('top', `${event.clientY}px`);
                    }
                } else if ($('#right-mouse-options').children().length <= 0) {
                    $('#right-mouse-options').remove();
                }
                break;
            default:
                console.log('You have a strange Mouse!');
                break;
        }
    })

    $('#hora-total').text(format(totalDuration));
    if ($('.list-itens-playlist').children('.cordilheia-item-playlist').length != 0) {
        $('.list-itens-playlist').children().removeClass('now-playing');
        $('.list-itens-playlist').children()[itematual].classList.add('now-playing');
    }
}

$('#playlist-open-y40so9').click(function() {
    $('.player-T1ow86>.is-overlay').css('display', 'block');
    $('.player-playlist').css('z-index', '10');

    setTimeout(() => {
        $('.player-T1ow86>.is-overlay').css('opacity', '0.85');
        $('.player-playlist').css('width', '450px');
        $('.player-playlist').css('min-width', '240px');
        setTimeout(() => {
            $('.player-playlist').removeClass('animation-default');
        }, 410);
    }, 10);
});

$('#over-Rtj493').click(function() {
    $('.player-T1ow86>.is-overlay').css('opacity', '0');
    $('.player-playlist').addClass('animation-default');
    $('.player-playlist').css('min-width', '0px');
    $('.player-playlist').css('width', '0px');

    setTimeout(() => {
        $('.player-playlist').css('z-index', '-1');
        $('.player-T1ow86>.is-overlay').css('display', 'none');
    }, 410);
});

function eventNextItem() {
    if (playlist[itematual + 1] != undefined) {
        nextVideo = true;
        itematual++;
        console.log('[player] Proximo item da lista.');
        updatePlay(itematual);
    }
}

function eventPreviousItem() {
    if (playlist[itematual - 1] != undefined) {
        previousVideo = true;
        itematual--;
        console.log('[player] Item anterior da lista.');
        updatePlay(itematual);
    }
}

$('.ply-next-button').click(eventNextItem);
$('.ply-previous-button').click(function() {
    if (videoNode.currentTime <= 1) {
        eventPreviousItem();
    } else {
        videoNode.currentTime = 0;
    }
});

var inputNode = document.getElementById('pb-input');
inputNode.addEventListener('change', playSelectedFile, false);

function play_video() {
    if (videoNode.played.length != 0) {
        if (videoNode.played.start(0) == 0 && !videoNode.paused) {
            // isPlay = false;
            videoNode.pause();
            BPlay.children().remove();
            BPlay.html(`<span><span class="fa fa-play"></span></span>`);
        } else {
            // isPlay = true;
            videoNode.play();
            BPlay.children().remove();
            BPlay.html(`<span><span class="fa fa-pause"></span></span>`);
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
        eventNextItem();
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
        videoNode.volume = 1;
        sliderVol.style.width = 100 + "%";
    }
});

$('.ply-volume-panel')
    .mousedown(function(event) {
        ply_volume_panel_drag = true;
        $(this).css('width', '70px');
        $(this).css('opacity', '1');
    })
    .on("mouseup mouseleave", function(event) {
        ply_volume_panel_drag = false;
        $(this).css('width', '0px');
        $(this).css('opacity', '0');
    })
    .mousemove(function(event) {
        if (ply_volume_panel_drag == false) return;
        let position = event.pageX - $(this).offset().left;
        let percentage = 100 * position / $(this).width();
        if ((percentage / 100) >= 1) {
            $('.ply-volume-slider').css('width', '100%');
            videoNode.volume = 1;
        } else if ((percentage / 100) <= 0) {
            $('.ply-volume-slider').css('width', '0%');
            videoNode.volume = 0;
        } else {
            $('.ply-volume-slider').css('width', percentage + '%');
            videoNode.volume = percentage / 100;
        }
    });

$('.player-progress-bar')
    .mousedown(function(event) {
        player_progress_bar_click = true;
        var pctBar = (event.clientX / barProgress.clientWidth) * 100;
        videoNode.currentTime = (videoNode.duration * pctBar) / 100;
    })
    .on("mouseup mouseleave", function(event) {
        player_progress_bar_click = false;
    })
    .mousemove(function(event) {
        if (player_progress_bar_click == false) return;
        var pctBar = (event.clientX / barProgress.clientWidth) * 100;
        videoNode.currentTime = (videoNode.duration * pctBar) / 100;
    });

$('.player-playlist > .infinity-dock-resize-handle')
    .mousedown(function(event) {
        resize_drag = true;
        $('.player-playlist > .infinity-dock-cursor-overlay').addClass('infinity-dock-cursor-overlay-visible');
    });

$('.player-playlist > .infinity-dock-cursor-overlay')
    .mouseup(function(event) {
        resize_drag = false;
        $(this).removeClass('infinity-dock-cursor-overlay-visible');
    })
    .mousemove(function(event) {
        if (resize_drag == false) return;
        let parent = $(this).parent();
        parent.css('width', event.clientX);
    });