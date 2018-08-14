const moment = require('moment');
moment.locale('pt-br');

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
    };

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

        // await reloadLembretes();
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

module.exports = {
    initCalendar: async() => {
        let wg;
        $('.widget-container').each((index, element) => {
            if ($(element).attr('widget') == 'calendar') {
                wg = element;
            }
        })
        if (wg) {
            Date_now = moment();
            $(wg).append(`
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

        await reloadCalendar(Date_now);
    }
}