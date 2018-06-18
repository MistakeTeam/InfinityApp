let Date_now = moment(),
    monthindex = 0,
    yearindex = 0,
    LembretesCode = ``,
    today = {
        "date": Date_now.get('date'),
        "day": moment.weekdays(Date_now.get('day')),
        "month": Date_now.get('month'),
        "year": Date_now.get('year'),
    },
    color = [
        "#528bff",
        "#2b0b69",
        "#1f8207",
        "#d4a90d",
        "#da3510",
        "#dc0825"
    ],
    DataCalendar = {
        months: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
        monthsShort: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
        weekdays: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
        weekdaysMin: ["Do", "2ª", "3ª", "4ª", "5ª", "6ª", "Sá"],
        weekdaysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    }

function moreOpCalendar() {
    $('.titlebar-buttons').append(`
        <div class="app-button-style" id="calendar-button-new"><span class="fa fa-ellipsis-h"></span></div>
    `);

    $('#calendar-button-new').click(
        (event) => {
            setTimeout(() => {
                if ($('#right-mouse-options').length == 0) {
                    $('.downmost').append(`<div id="right-mouse-options" style="left: 28px; right: auto; bottom: auto;"><div id="container-options"></div></div>`);
                    CLOSE_MENU = true;

                    let lite = [{
                        id: "module-rmouse-create-lembretes",
                        text: "Criar lembete",
                        generator: function() {
                            setTimeout(() => {
                                $('#right-mouse-options').remove();

                                function adRevelOpitons(date) {
                                    if (!date || date == undefined) date = { date: today.date, month: today.month, year: today.year };
                                    let htmlText = `
                                <div>
                                    <span class="lembrete-text-name-over">Dia</span>
                                    <div class="date-start-date">
                                        <span>${date.date < 10 ? "0" + date.date : date.date}</span>
                                        <div>
                                            <span class="fa fa-arrow-up"></span>
                                            <span class="fa fa-arrow-down"></span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span class="lembrete-text-name-over">Mês</span>
                                    <div class="date-start-month">
                                        <span>${DataCalendar.months[date.month]}</span>
                                        <div>
                                            <span class="fa fa-arrow-up"></span>
                                            <span class="fa fa-arrow-down"></span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span class="lembrete-text-name-over">Ano</span>
                                    <div class="date-start-year">
                                        <span>${date.year}</span>
                                        <div>
                                            <span class="fa fa-arrow-up"></span>
                                            <span class="fa fa-arrow-down"></span>
                                        </div>
                                    </div>
                                </div>
                                `;
                                    $('#lembrete-add-date-start > div').append(htmlText);
                                    $('#lembrete-add-date-end > div').append(htmlText);
                                }
                                if ($('#calendar-area-lateral').length == 0) {
                                    $('#calendar-main').append(`
                                <div id="calendar-area-lateral" style="min-width: 0px; width: 0px;">
                                    <div class="infinity-dock-resize-handle resize-right"></div>
                                    <div class="infinity-dock-cursor-overlay resize-left"></div>
                                    <div id="area-container">
                                        <div id="lembrete-add-name">
                                            <input type="text" class="input-text-menu">
                                            <span class="lembrete-text-name-over">Nome</span>
                                        </div>
                                        <div id="lembrete-box-container-date">
                                            <span class="lembrete-text-name-over">Data de início</span>
                                            <div id="lembrete-add-date-start">
                                                <div></div>
                                            </div>
                                            <div class="indication-text-menu">
                                                <div class="line-over-effects"></div>
                                                <span class="lembrete-text-name-over">Data de termíno</span>
                                            </div>
                                            <div id="lembrete-add-date-end">
                                                <div></div>
                                            </div>
                                            <div class="indication-text-menu">
                                                <div class="line-over-effects"></div>
                                                <span class="lembrete-text-name-over">Opções</span>
                                            </div>
                                            <div id="lembrete-add-date-end-options">
                                                <div>
                                                    <div>
                                                        <div class="infinity-check-option-style">
                                                            <div class="infinity-check-option-style-box">
                                                                <div class="infinity-check-option-style-button" id="calendar-repeat" data-check="false"></div>
                                                                <label for="calendar-repeat"></label>
                                                            </div>
                                                            <span class="infinity-check-option-style-name">Repetir</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div id="calendar-repeat-options-box" style="display: none;"></div>
                                                    </div>                                                
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `);
                                    adRevelOpitons();
                                } else {
                                    return;
                                }
                                setTimeout(() => {
                                    $('#calendar-area-lateral')
                                        .addClass('animation-default')
                                        .css('min-width', '300px')
                                        .css('width', '300px')
                                        .css('z-index', '10');

                                    $('#over-vo4nbw').css('display', 'block');
                                    setTimeout(() => {
                                        $('#over-vo4nbw').css('opacity', '0.85');
                                    }, 10);

                                    setTimeout(() => {
                                        $('#calendar-area-lateral').removeClass('animation-default');
                                    }, 410);
                                }, 100);

                                $('#calendar-area-lateral > .infinity-dock-resize-handle')
                                    .mousedown(function(event) {
                                        resize_drag = true;
                                        $('#calendar-area-lateral > .infinity-dock-cursor-overlay').addClass('infinity-dock-cursor-overlay-visible');
                                    });

                                $('#calendar-area-lateral > .infinity-dock-cursor-overlay')
                                    .mouseup(function(event) {
                                        resize_drag = false;
                                        $(this).removeClass('infinity-dock-cursor-overlay-visible');
                                    })
                                    .mousemove(function(event) {
                                        if (resize_drag == false) return;
                                        $(this).parent().css('width', event.clientX);
                                    });

                                $('.infinity-check-option-style-box').click((event) => {
                                    if ($(event.currentTarget).children('.infinity-check-option-style-button').attr('data-check') == 'true') {
                                        $(event.currentTarget).children('.infinity-check-option-style-button').attr('data-check', 'false');
                                        $(event.currentTarget).children('.infinity-check-option-style-button').removeAttr('checked');
                                        $('#calendar-repeat-options-box').css('display', 'none');
                                    } else if ($(event.currentTarget).children('.infinity-check-option-style-button').attr('data-check') == 'false') {
                                        $(event.currentTarget).children('.infinity-check-option-style-button').attr('data-check', 'true');
                                        $(event.currentTarget).children('.infinity-check-option-style-button').attr('checked', '');
                                        $('#calendar-repeat-options-box').css('display', 'block');
                                    }
                                });

                                function eachDateCheck(i, e) {
                                    if ($(e).hasClass('date-start-date')) {
                                        var textsp = $(e).children('div');

                                        $(textsp.children()[0]).click((event) => {
                                            var n = textsp.parent().children('span').text();

                                            n++;
                                            if (n > 0 && n < 10) {
                                                textsp.parent().children('span').text("0" + n);
                                            } else if (n <= 31) {
                                                textsp.parent().children('span').text(n);
                                            } else if (n > 31) {
                                                textsp.parent().children('span').text('01');
                                                n = 1;
                                                var monthN = DataCalendar.months.indexOf(textsp.parent().parent().parent().children().children('.date-start-month').children('span').text()),
                                                    monthText = textsp.parent().parent().parent().children().children('.date-start-month').children('span');

                                                monthN++;
                                                if (monthN > 0 && monthN < 10) {
                                                    monthText.text(DataCalendar.months[monthN]);
                                                } else if (monthN <= 11) {
                                                    monthText.text(DataCalendar.months[monthN]);
                                                } else if (monthN > 11) {
                                                    monthN = 0;
                                                    monthText.text(DataCalendar.months[monthN]);

                                                    var yearN = textsp.parent().parent().parent().children().children('.date-start-year').children('span').text(),
                                                        yearText = textsp.parent().parent().parent().children().children('.date-start-year').children('span');

                                                    yearN++;
                                                    if (yearN > 1900 && yearN < 2099) {
                                                        yearText.text(yearN);
                                                    } else if (yearN >= 2099) {
                                                        yearN = 2099;
                                                        yearText.text(yearN);
                                                    }
                                                }
                                            }
                                        });

                                        $(textsp.children()[1]).click((event) => {
                                            var n = textsp.parent().children('span').text();

                                            n--;
                                            if (n > 0) {
                                                if (n > 0 && n < 10) {
                                                    textsp.parent().children('span').text("0" + n);
                                                } else if (n <= 31) {
                                                    textsp.parent().children('span').text(n);
                                                }
                                            } else {
                                                textsp.parent().children('span').text('31');
                                                n = 31;
                                                var monthN = DataCalendar.months.indexOf(textsp.parent().parent().parent().children().children('.date-start-month').children('span').text()),
                                                    monthText = textsp.parent().parent().parent().children().children('.date-start-month').children('span');

                                                monthN--;
                                                if (monthN > 0) {
                                                    if (monthN > 0 && monthN < 10) {
                                                        monthText.text(DataCalendar.months[monthN]);
                                                    } else if (monthN < 11) {
                                                        monthText.text(DataCalendar.months[monthN]);
                                                    }
                                                } else {
                                                    monthN = 11;
                                                    monthText.text(DataCalendar.months[monthN]);

                                                    var yearN = textsp.parent().parent().parent().children().children('.date-start-year').children('span').text(),
                                                        yearText = textsp.parent().parent().parent().children().children('.date-start-year').children('span');

                                                    yearN--;
                                                    if (yearN >= 1900) {
                                                        if (yearN >= 1900 && yearN <= 2099) {
                                                            yearText.text(yearN);
                                                        } else if (yearN > 2099) {
                                                            yearN = 2099;
                                                            yearText.text(yearN);
                                                        }
                                                    } else {
                                                        yearN = 1900;
                                                        yearText.text(yearN);
                                                    }
                                                }
                                            }
                                        });
                                    } else if ($(e).hasClass('date-start-month')) {
                                        var textsp = $(e).children('div');

                                        $(textsp.children()[0]).click((event) => {
                                            var n = DataCalendar.months.indexOf(textsp.parent().children('span').text());

                                            n++;
                                            if (n > 0 && n < 10) {
                                                textsp.parent().children('span').text(DataCalendar.months[n]);
                                            } else if (n <= 11) {
                                                textsp.parent().children('span').text(DataCalendar.months[n]);
                                            } else if (n > 11) {
                                                n = 0;
                                                textsp.parent().children('span').text(DataCalendar.months[n]);

                                                var yearN = textsp.parent().parent().parent().children().children('.date-start-year').children('span').text(),
                                                    yearText = textsp.parent().parent().parent().children().children('.date-start-year').children('span');

                                                yearN++;
                                                if (yearN > 1900 && yearN < 2099) {
                                                    yearText.text(yearN);
                                                } else if (yearN >= 2099) {
                                                    yearN = 2099;
                                                    yearText.text(yearN);
                                                }
                                            }
                                        });

                                        $(textsp.children()[1]).click((event) => {
                                            var n = DataCalendar.months.indexOf(textsp.parent().children('span').text());

                                            n--;
                                            if (n > 0) {
                                                if (n > 0 && n < 10) {
                                                    textsp.parent().children('span').text(DataCalendar.months[n]);
                                                } else if (n < 11) {
                                                    textsp.parent().children('span').text(DataCalendar.months[n]);
                                                }
                                            } else {
                                                n = 11;
                                                textsp.parent().children('span').text(DataCalendar.months[n]);

                                                var yearN = textsp.parent().parent().parent().children().children('.date-start-year').children('span').text(),
                                                    yearText = textsp.parent().parent().parent().children().children('.date-start-year').children('span');

                                                yearN--;
                                                if (yearN >= 1900) {
                                                    if (yearN >= 1900 && yearN <= 2099) {
                                                        yearText.text(yearN);
                                                    } else if (yearN > 2099) {
                                                        yearN = 2099;
                                                        yearText.text(yearN);
                                                    }
                                                } else {
                                                    yearN = 1900;
                                                    yearText.text(yearN);
                                                }
                                            }
                                        });
                                    } else if ($(e).hasClass('date-start-year')) {
                                        var textsp = $(e).children('div');

                                        $(textsp.children()[0]).click((event) => {
                                            var n = textsp.parent().children('span').text();

                                            n++;
                                            if (n > 1900 && n < 2099) {
                                                textsp.parent().children('span').text(n);
                                            } else if (n >= 2099) {
                                                n = 2099;
                                                textsp.parent().children('span').text('2099');
                                            }
                                        });

                                        $(textsp.children()[1]).click((event) => {
                                            var n = textsp.parent().children('span').text();

                                            n--;
                                            if (n >= 1900) {
                                                if (n >= 1900 && n <= 2099) {
                                                    textsp.parent().children('span').text(n);
                                                } else if (n > 2099) {
                                                    n = 2099;
                                                    textsp.parent().children('span').text('2099');
                                                }
                                            } else {
                                                n = 1900;
                                                textsp.parent().children('span').text('1900');
                                            }
                                        });
                                    }
                                }

                                $('#lembrete-add-date-end > div > div > div').each(eachDateCheck);
                                $('#lembrete-add-date-start > div > div > div').each(eachDateCheck);
                            }, 10);
                        }
                    }];
                    lite.forEach((value, index, array) => {
                        $('#right-mouse-options>#container-options').append(`<div class="options-item" id="${value.id}"><span>${value.text}</span></div>`);
                        $(`#${value.id}`).click(value.generator);
                    });
                } else if ($('#right-mouse-options').length > 0) {
                    $('#right-mouse-options').remove();
                }
            }, 100);
        }
    );
}

async function initCalendar() {
    if ($('#util-calendar').length == 0) {
        Date_now = moment();
        $('.country-gp-dnn').append(`
        <div style="visibility: hidden;" id="util-calendar">
            <div id="calendar-main">
                <div id="calendar-topbar">
                    <div id="calendar-back"><span><span class="fa fa-arrow-left"></span></span></div>
                    <div id="calendar-name-item">NO_TEXT_PROVIDER</div>
                    <div id="calendar-next"><span><span class="fa fa-arrow-right"></span></span></div>
                </div>
                <div id="calendar-days">
                    <span style="border-right: 1px dashed #403e3e;">NO_TEXT_PROVIDER</span>
                    <span style="border-right: 1px dashed #403e3e;">NO_TEXT_PROVIDER</span>
                    <span style="border-right: 1px dashed #403e3e;">NO_TEXT_PROVIDER</span>
                    <span style="border-right: 1px dashed #403e3e;">NO_TEXT_PROVIDER</span>
                    <span style="border-right: 1px dashed #403e3e;">NO_TEXT_PROVIDER</span>
                    <span style="border-right: 1px dashed #403e3e;">NO_TEXT_PROVIDER</span>
                    <span>NO_TEXT_PROVIDER</span>
                </div>
                <div id="calendar-init"></div>
                <div class="is-overlay animation-default" id="over-vo4nbw" style="display: none; opacity: 0;"></div>
            </div>
        </div>
        `);

        $('#calendar-days').children().each((i, e) => {
            $(e).text(moment.weekdays(i));
        })

        $("#calendar-back").click(() => {
            console.log(`[calendar] De volta ao passado.`);
            Date_now.set("month", monthindex - 1);
            reloadCalendar(Date_now);
        });

        $("#calendar-next").click(() => {
            console.log(`[calendar] De volta para o futuro.`);
            Date_now.set("month", monthindex + 1);
            reloadCalendar(Date_now);
        });

        $('#over-vo4nbw').click(function() {
            $(this).css('opacity', '0');
            $('#calendar-area-lateral').addClass('animation-default')
                .css('min-width', '0px')
                .css('width', '0px');

            setTimeout(() => {
                $(this).css('display', 'none');
                $('#calendar-area-lateral').remove();
            }, 410);
        });
    }

    await moreOpCalendar();
    await reloadCalendar(Date_now);
}

async function reloadCalendar(a) {
    let Date_temp = a;
    console.log(`[calendar] Reajustando calendario.`);
    $('#calendar-init').children().remove();
    $('#calendar-name-item').text(`${Date_temp.format("MMMM")}/${Date_temp.get('year')}`);
    monthindex = Date_temp.get('month');
    yearindex = Date_temp.get('year');
    Date_temp.subtract((Date_temp.date() - 1), "days");
    Date_temp.subtract(Date_temp.day(), "days");
    for (let i = 1; i < 43; i++) {
        let CName = `calendar-day`;
        let Styletext = ``;
        if (!isMultiplicador(i, 7)) {
            Styletext += `border-right: 1px dashed #403e3e;`;
        }
        if (i < 36) {
            Styletext += ` border-bottom: 1px dashed #403e3e;`;
        }
        if (Date_temp.get('date') == today.date && Date_temp.get('month') == today.month && Date_temp.get('year') == today.year) {
            CName += ` today`;
        }

        await reloadLembretes(optionData.calendar);
        $('#calendar-init').append(`
        <div class="${CName}" style="${Styletext}" day="${moment.weekdays(Date_temp.get('day'))}" date="${Date_temp.get('date')}" month="${Date_temp.get('month')}" year="${Date_temp.get('year')}">
            <span>${Date_temp.get('Date')}</span>
            <div class="calendar-list-events">${LembretesCode}</div>
        </div>
        `);
        Date_temp.add(1, "day");
    }
    Date_temp.subtract(43 - (Date_temp.date() - 1) - Date_temp.day(), "days");
}

async function reloadLembretes(list) {
    LembretesCode = ``;
    /*
    {
        title: "Test work",
        color: "#fff",
        repeat: {
            enabled: false,
            type: "week"
        },
        date: {
            date: 01,
            month: 01,
            year: 2018
        }
    }
    */
    list.forEach((v, i, a) => {
        function addLembrete() {
            if (i <= 3) {
                LembretesCode += `
                <div>
                    <div class="calendar-lembretes" style="background-color: ${v.color ? v.color : color[Math.floor(Math.random() * color.length)]};">
                        <span>${v.title}</span>
                    </div>
                </div>
                `;
            } else {
                if (!LembretesCode.includes('calendar-more-lembretes')) {
                    LembretesCode += `
                    <div>
                        <div class="calendar-more-lembretes">
                            <span>+${list.length - 4}</span>
                        </div>
                    </div>
                    `;
                }
            }
        }

        if (v.repeat.enabled == false) {
            if (Date_now.get('date') == v.date.date && Date_now.get('month') == v.date.month && Date_now.get('year') == v.date.year) {
                addLembrete();
            }
        } else {
            switch (v.repeat.type) {
                case 'week':
                    if (Date_now.get('day') == v.date.day) {
                        addLembrete();
                    }
                    break;
                case 'month':
                    if (Date_now.get('date') == v.date.date) {
                        addLembrete();
                    }
                    break;
                case 'year':
                    if (Date_now.get('date') == v.date.date && Date_now.get('month') == v.date.month) {
                        addLembrete();
                    }
                    break;
                default:
                    break;
            }
        }
    });
}