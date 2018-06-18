const { remote } = require('electron');
const { eventEmitter } = require('./events.js');
let notifyIndex;
let statusbarItem;
let notifications = [];

function notify(title, data) {
    const options = Object.assign({}, data);
    if (!options.message) {
        throw new Error('[notify] ERROR no find message.')
    }
    if (!options.sound) {
        options.sound = 'sounds/online.mp3';
    }
    notifyIndex = notifications.push({
        title: title,
        message: options.message,
        icon: options.icon ? options.icon : 'img/icons/logo.png',
        read: false
    });
    notifyIndex--;
    $('.statusbar-item').each((index, element) => {
        if ($(element).attr('status-type') == 'notifications') {
            statusbarItem = $(element);
        }
    });
    if (!options.noNotify) {
        if ($('.list-notifications').length == 0) {
            $('.downmost').append(`
            <div class="list-notifications"></div>
            `);
        }
        $('.list-notifications').append(`
        <div class="notification-push animation-default" index="${notifyIndex}" style="left: calc(100% - 300px); opacity: 0;">
            <img src="${notifications[notifyIndex].icon}" style="max-height: 50px;"></img>
            <div style="flex-direction: column; display: flex; padding: 5px;">
                <span id="notification-push-title">${notifications[notifyIndex].title}</span>
                <span id="notification-push-message">${notifications[notifyIndex].message}</span>
            </div>
        </div>
        `);
        $('.notification-push').each((index, element) => {
            if ($(element).attr('index') == notifyIndex) {
                setTimeout(() => {
                    $(element).css('left', 'calc(100% - 345px)');
                    $(element).css('opacity', '1');
                    $(element).css('z-index', '15');

                    $(element).click(function(e) {
                        $(element).remove();
                        if (!notifications[$(element).attr('index')].read) {
                            notifications[$(element).attr('index')].read = true;
                        }
                        UpdateNewNotifications();
                    });

                    setTimeout(() => {
                        $(element).remove();
                    }, 10 * 1000);
                }, 10);
            }
        });
    }
    UpdateNewNotifications();
}

function UpdateNewNotifications() {
    console.log(`[UpdateNewNotifications] Atualizando sinalizador de novas notificações`);
    let length_notifications = 0;
    notifications.forEach((notification, index) => {
        if (!notification.read) {
            length_notifications++;
        }
    });
    if (length_notifications >= 1) {
        statusbarItem.attr('title', (lang.statusbar_item_n_notifications_title).replace('#notification#', length_notifications));
    } else {
        statusbarItem.attr('title', lang.statusbar_item_not_notifications_title);
    }
    if (length_notifications >= 1 && length_notifications <= 9) {
        statusbarItem.children('span').html(`<span class="fa fa-bell"></span> ${length_notifications}`)
    } else if (length_notifications > 9) {
        statusbarItem.children('span').html(`<span class="fa fa-bell"></span> +9`);
    } else {
        statusbarItem.children('span').html(`<span class="fa fa-bell"></span>`);
    }
}

eventEmitter.on('statusbar-item-notification', () => {
    if ($('.central-notifications').length == 0) {
        $('.downmost').append(`
        <div class="central-notifications animation-default" style="left: calc(100% - 300px); opacity: 0;">
            <div class="topbar-notifications">
                <span>${lang.statusbar_item_central_notifications_title}</span>
            </div>
            <div class="active-notifications animation-default">
                <span id="noNotification" style="padding: 5px; margin: auto; display: flex;">Nenhuma notificação.</span>
            </div>
        </div>
        `);
        CLOSE_MENU = true;
        setTimeout(() => {
            $('.central-notifications').css('left', 'calc(100% - 335px)');
            $('.central-notifications').css('opacity', '1');
            $('.central-notifications').css('z-index', '15');

            notifications.forEach((notification, index) => {
                if ($('#noNotification').length != 0) {
                    $('#noNotification').remove();
                }
                let classNames = "notification-item";
                if (!notification.read) {
                    classNames += " notification-unread";
                }
                $('.active-notifications').append(`
                <div class="${classNames}" index="${index}">
                    <img src="${notification.icon}" style="max-height: 50px;"></img>
                    <div style="flex-direction: column; display: flex; padding: 5px;">
                        <span id="notification-item-title-${index}">${notification.title}</span>
                        <span id="notification-item-message-${index}" style="white-space: nowrap;">${notification.message}</span>
                    </div>
                </div>
                `);
            });
            $('.notification-item')
                .hover(function(event) {
                    if (!notifications[$(this).attr('index')].read) {
                        notifications[$(this).attr('index')].read = true;
                        UpdateNewNotifications();
                    }
                })
                .click((event) => {
                    if ($(this).children(`#notification-item-message-${$(this).attr('index')}`).css('white-space') == 'normal') {
                        $(this).children(`#notification-item-message-${$(this).attr('index')}`).css('white-space', 'nowrap');
                    } else {
                        $(this).children(`#notification-item-message-${$(this).attr('index')}`).css('white-space', 'normal');
                    }
                });
        }, 10);
    } else {
        $('.central-notifications').remove();
    }
});

module.exports = notify;