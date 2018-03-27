'use strict';

function OptionContentsClick() {
    if ($(this).hasClass('selected-item')) {
        return;
    }
    $('.option-contents').removeClass('selected-item');
    switch ($(this).attr('type')) {
        case 'geral':
            $('#option-right-sidebar').children().children().remove();
            $('#option-right-sidebar').children().css('display', 'none');
            $('#general-box').css('display', 'block');
            $(this).addClass('selected-item');
            $('#general-box').append(`
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
            <div id="config-general-box" style="display: none;">
                <div class="mr-check">
                    <div class="mr-text">
                        <div class="mr-text-title">
                            <span>Desativar animações</span>
                            <div class="switch">
                                <div class="cmn-toggle cmn-toggle-round" data-internal-name="AnimationRun" data-check="false" id="mr-check-1"></div>
                                <label for="mr-check-1"></label>
                            </div>
                        </div>
                        <div class="mr-text-description">
                            <span>Animações afeta o desempenho do aplicativo, recomanda-se desativa-las se seu desempenho estiver comprometido.</span>
                        </div>
                    </div>
                </div>
            </div>
            `);
            eventEmitter.emit('AnimationRunClick');
            setTimeout(() => {
                $('#config-general-box').css('display', 'block');
                $('#general-box>.loading-init').remove();
            }, Math.random() * 1000);
            break;
        case 'temas':
            $('#option-right-sidebar').children().children().remove();
            $('#option-right-sidebar').children().css('display', 'none');
            $('#theme-box').css('display', 'block');
            $('#theme-box').append(`
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
            <div id="config-theme-box" style="display: none;">
                <div>
                    <div style="display: flow-root; padding: 5px;">
                        <div id="theme-reload-button" class="button-default" style="cursor: pointer; float: right;">Reload</div>
                    </div>
                    <span><span class="fa fa-paint-brush"></span> Themes</span>
                    <div id="theme-list" class="flexboxi">
                        <div class="drag-drop-runs" type="theme" style="height: 30px; width: 100%;">
                            <div class="progress-bar animation-default" style="width: 0%;"></div>
                            <span id="text-theme" style="display: block;">#theme-count# tema disponivel(Arraste e solte temas aqui, para serem adicionados)</span>
                        </div>
                    </div>
                    <span><span class="fa fa-images"></span> Wallpaper</span>
                    <div id="wallpaper-list" class="flexboxi">
                        <div class="drag-drop-runs" type="wallpaper" style="height: 30px; width: 100%;">
                            <div class="progress-bar animation-default" style="width: 0%;"></div>
                            <span id="text-wallpaper" style="display: block;">#wallpaper-count# wallpaper disponivel(Arraste e solte wallpaper aqui, para serem adicionados)</span>
                        </div>
                    </div>
                </div>
            </div>
            `);
            $('#theme-box').css('-webkit-clip-path', '200% at 50% 50%');
            $('#theme-box').css('clip-path', '200% at 50% 50%');
            $('#theme-reload-button').click(() => {
                $('#theme-reload-button').html(`<span><span class="fa fa-sync-alt"></span> Reloading...</span>`);
                $('#theme-reload-button').children('span').children('span').addClass('roling-animation');
                setTimeout(() => {
                    refreshtheme();
                    checkTheme();
                    $('#theme-reload-button').html(`Reload`);
                }, 300);
            });
            $('.drag-drop-runs').on({
                dragenter: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).children('#text-wallpaper').text('Solte!!');
                    $(this).children('#text-theme').text('Solte!!');
                },
                dragleave: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).children('#text-wallpaper').text(`${$('#wallpaper-list').children().length - 1} wallpaper disponivel(Arraste e solte wallpaper aqui, para serem adicionados)`);
                    $(this).children('#text-theme').text(`${$('#theme-list').children().length - 1} tema disponivel(Arraste e solte temas aqui, para serem adicionados)`);
                },
                drop: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let files = e.originalEvent.dataTransfer.files;
                    if (files.length > 0) {
                        switch ($(this).attr('type')) {
                            case 'wallpaper':
                                // $(this).children('#text-wallpaper').text(`${files[0].name} Size: ${bytesToSize(files[0].size)}`);
                                $(this).children('#text-wallpaper').text(`Preparando-se para copiar o wallpaper...`);
                                for (let i = 0; i < files.length; i++) {
                                    if (i < 5) {
                                        if (["image/png", "image/jpeg"].includes(files[i].type)) {
                                            fs.exists(`${process.env.APPDATA}/InfinityApp/wallpaper/${files[i].name}`, (exists) => {
                                                if (!exists) {
                                                    let y = $(this);
                                                    var stat = fs.statSync(files[i].path),
                                                        str = progress_stream({
                                                            length: stat.size,
                                                            time: 100
                                                        }),
                                                        rd = fs.createReadStream(files[i].path),
                                                        wr = fs.createWriteStream(`${process.env.APPDATA}/InfinityApp/wallpaper/${files[i].name}`);

                                                    str.on('progress', function(progress) {
                                                        y.children('#text-wallpaper').text(`Copiando... ${Math.round(progress.percentage)}%`);
                                                        y.children('.progress-bar').css('width', '100%');
                                                    });

                                                    rd
                                                        .once('error', (err) => {
                                                            console.log(err);
                                                        })
                                                        .once('end', () => {
                                                            setTimeout(() => {
                                                                y.children('#text-wallpaper').text(`Wallpaper adicionado: ${files[i].name}`);
                                                                setTimeout(() => {
                                                                    y.children('#text-wallpaper').text(`${$('#wallpaper-list').children().length - 1} wallpaper disponivel(Arraste e solte wallpaper aqui, para serem adicionados)`);
                                                                    y.children('.progress-bar').css('width', '0%');
                                                                    refreshtheme();
                                                                }, 6000);
                                                            }, 100);
                                                        })
                                                        .pipe(str)
                                                        .pipe(wr)
                                                } else {
                                                    $(this).children('#text-wallpaper').text(`Wallpaper já existe.`);
                                                }
                                            });
                                        } else {
                                            $(this).children('#text-wallpaper').text(`Não é um wallpaper valido.`);
                                        }
                                    }
                                }
                                break;
                            case 'theme':
                                // $(this).children('#dragenter-text-theme').text(`${files[0].name} Size: ${bytesToSize(files[0].size)}`);
                                $(this).children('#dragenter-text-theme').text(`Preparando-se para copiar o tema...`);
                                for (let i = 0; i < files.length; i++) {
                                    if (i < 5) {
                                        if (["text/css"].includes(files[i].type)) {
                                            fs.exists(`${process.env.APPDATA}/InfinityApp/themes/${files[i].name}`, (exists) => {
                                                if (!exists) {
                                                    let y = $(this);
                                                    var stat = fs.statSync(files[i].path),
                                                        str = progress_stream({
                                                            length: stat.size,
                                                            time: 100
                                                        }),
                                                        rd = fs.createReadStream(files[i].path),
                                                        wr = fs.createWriteStream(`${process.env.APPDATA}/InfinityApp/themes/${files[i].name}`);

                                                    str.on('progress', function(progress) {
                                                        y.children('#text-theme').text(`Copiando... ${Math.round(progress.percentage)}%`);
                                                        y.children('.progress-bar').css('width', '100%');
                                                    });

                                                    rd
                                                        .once('error', (err) => {
                                                            console.log(err);
                                                        })
                                                        .once('end', () => {
                                                            setTimeout(() => {
                                                                y.children('#text-theme').text(`Tema adicionado: ${files[i].name}`);
                                                                setTimeout(() => {
                                                                    y.children('#text-theme').text(`${$('#theme-list').children().length - 1} tema disponivel(Arraste e solte temas aqui, para serem adicionados)`);
                                                                    y.children('.progress-bar').css('width', '0%');
                                                                    refreshtheme();
                                                                }, 6000);
                                                            }, 100);
                                                        })
                                                        .pipe(str)
                                                        .pipe(wr)
                                                } else {
                                                    $(this).children('#text-theme').text(`Tema já existe.`);
                                                }
                                            });
                                        } else {
                                            $(this).children('#text-theme').text(`Não é um tema valido.`);
                                        }
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    } else {
                        $(this).children('#text-wallpaper').text(`${$('#wallpaper-list').children().length - 1} wallpaper disponivel(Arraste e solte wallpaper aqui, para serem adicionados)`);
                        $(this).children('#text-theme').text(`${$('#theme-list').children().length - 1} tema disponivel(Arraste e solte temas aqui, para serem adicionados)`);
                    }
                }
            });
            $(this).addClass('selected-item');
            refreshtheme();
            setTimeout(() => {
                $('#config-theme-box').css('display', 'block');
                $('#theme-box>.loading-init').remove();
            }, Math.random() * 1000);
            break;
        case 'discord':
            $('#option-right-sidebar').children().children().remove();
            $('#option-right-sidebar').children().css('display', 'none');
            $('#discord-box').css('display', 'block');
            $(this).addClass('selected-item');
            $('#discord-box').append(`
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
            <div id="config-discord-box" style="display: none;">
                <div class="mr-check">
                    <div class="mr-text">
                        <div class="mr-text-title">
                            <span>Rich Presence</span>
                            <div class="switch">
                                <div class="cmn-toggle cmn-toggle-round" data-internal-name="rich" data-check="false" id="rich-check"></div>
                                <label for="rich-check"></label>
                            </div>
                        </div>
                        <div class="mr-text-description">
                            <span>Ative ou desative o rich presence do Discord.</span>
                        </div>
                    </div>
                </div>
            </div>
            `);
            DiscordCheck();
            $('.switch').click(DiscordRunClick);
            setTimeout(() => {
                $('#config-discord-box').css('display', 'block');
                $('#discord-box>.loading-init').remove();
            }, Math.random() * 1000);
            break;
        default:
            $('#option-right-sidebar').children().children().remove();
            $('#option-right-sidebar').children().css('display', 'none');
            $('#soon-box').css('display', 'block');
            $(this).addClass('selected-item');
            $('#soon-box').append(`
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
            <div id="soon-container-box" style="display: none;">
                <div class="soon-2tfY60">
                    <span>${$(this).text()} não está disponivel ainda</span>
                </div>
            </div>
            `);
            setTimeout(() => {
                $('#soon-container-box').css('display', 'block');
                $('#soon-box>.loading-init').remove();
            }, Math.random() * 1000);
            break;
    }
}

//options in-app
async function AnimationRunClick(event) {
    setTimeout(async() => {
        console.log(`[options] AnimationRun`);
        // AnimationRun
        if ($(this).children('.cmn-toggle').attr('data-internal-name') == "AnimationRun") {
            if (!$(this).children('.cmn-toggle').attr('checked')) {
                // Checked
                $(this).children('.cmn-toggle').attr('data-check', 'true');
                $(this).children('.cmn-toggle').attr('checked', '');
                $(this).children('.cmn-toggle').attr('active', '');

                // Ação
                await optionData.update({ "options.AnimationRun": true });
                $('.animation-default').addClass('animation-off');
                $('.animation-default').removeClass('animation-default');
            } else {
                // Checked
                $(this).children('.cmn-toggle').attr('data-check', 'false');
                $(this).children('.cmn-toggle').removeAttr('checked');
                $(this).children('.cmn-toggle').removeAttr('active');

                // Ação
                await optionData.update({ "options.AnimationRun": false });
                $('.animation-off').addClass('animation-default');
                $('.animation-off').removeClass('animation-off');
            }
        }

        await refreshDB();
    }, 1);
}

async function DiscordRunClick(event) {
    setTimeout(async() => {
        console.log(`[options] Rich Presence`);
        // Rich Presence
        if ($(this).children('.cmn-toggle').attr('data-internal-name') == "rich") {
            if (!$(this).children('.cmn-toggle').attr('checked')) {
                // Checked
                $(this).children('.cmn-toggle').attr('data-check', 'true');
                $(this).children('.cmn-toggle').attr('checked', '');
                $(this).children('.cmn-toggle').attr('active', '');

                // Ação
                await optionData.update({ "options.rich": true });
                startRich();
            } else {
                // Checked
                $(this).children('.cmn-toggle').attr('data-check', 'false');
                $(this).children('.cmn-toggle').removeAttr('checked');
                $(this).children('.cmn-toggle').removeAttr('active');

                // Ação
                await optionData.update({ "options.rich": false });
                startRich();
            }
        }

        await refreshDB();
    }, 1);
}

eventEmitter.on('AnimationRunClick', () => {
    if ($('.cmn-toggle').attr('data-internal-name') == 'AnimationRun') {
        $('.cmn-toggle').parent().click(AnimationRunClick);
        eventEmitter.emit('onStartupApp');
    }
});

async function DiscordCheck() {
    if (optionData.options.rich == true) {
        $('#rich-check').attr('data-check', 'true');
        $('#rich-check').attr('checked', '');
        $('#rich-check').attr('active', '');
    } else {
        $('#rich-check').attr('data-check', 'false');
        $('#rich-check').removeAttr('checked');
        $('#rich-check').removeAttr('active');
    }
    console.log(`[options] Dscord checked`);
}

async function onStartupApp(event) {
    // AnimationRun
    if (optionData.options.AnimationRun == true) {
        // Checked
        $('.switch').children('#mr-check-1').attr('data-check', 'true');
        $('.switch').children('#mr-check-1').attr('checked', '');
        $('.switch').children('#mr-check-1').attr('active', '');

        // Ação
        $('.animation-default').addClass('animation-off');
        $('.animation-default').removeClass('animation-default');
    } else {
        // Checked
        $('.switch').children('#mr-check-1').attr('data-check', 'false');
        $('.switch').children('#mr-check-1').removeAttr('checked');
        $('.switch').children('#mr-check-1').removeAttr('active');

        // Ação
        $('.animation-off').addClass('animation-default');
        $('.animation-off').removeClass('animation-off');
    }

    console.log(`[options] checked`);
}

eventEmitter.on('onStartupApp', onStartupApp);