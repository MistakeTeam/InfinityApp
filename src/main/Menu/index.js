const data = gearbox.Component('data');

(async() => {
    await data.MenuTopbar.forEach((v, i, a) => {
        let className = "menu-item";
        if (v.name == 'Home') className += " active";
        $('.menu-container').append(`
            <div class="${className}" id-menu="${v.id}"><span>${v.name}</span></div>
        `).click(event => {
            if ($(event.target).hasClass('disable')) return;
            if ($(event.target).hasClass('active')) return;
            $('.menu-item').each((index, element) => {
                $(element).removeClass('active');
                $(element).addClass('disable');
            });
            $($(event.target).hasClass('menu-item') ? $(event.target) : $(event.target).parent()).addClass('active');

            data.ModuleApps.forEach(async(v, i, a) => {
                if (v.id != $(event.target).attr('id-menu')) return;

                let aa = $('.util-app').children().addClass('left');
                await setTimeout(() => {
                    aa.remove();
                }, 500);
                await setTimeout(() => {
                    $('.util-app').append(`
                        <div id="${v.id_app}" class="animation-default right" id-app="${v.id}" style="display: none;"></div>
                    `);

                    $(`#${v.id_app}`).append((require(`${__dirname}/${v.module}`)));

                    $(`#${v.id_app}`).css('display', 'block');
                    setTimeout(() => {
                        $(`#${v.id_app}`).removeClass('right');
                        setTimeout(() => {
                            $('.menu-item').each((index, element) => {
                                $(element).removeClass('disable');
                            });
                        }, 600);
                    }, 10);
                }, 100);
            });
        });
    });

    $('.util-app').append(`
        <div id="${data.ModuleApps[0].id_app}" class="animation-default right" id-app="${data.ModuleApps[0].id}" style="display: none;"></div>
    `);

    $(`#${data.ModuleApps[0].id_app}`).append((require(`${__dirname}/${data.ModuleApps[0].module}`)));

    setTimeout(() => {
        $(`#${data.ModuleApps[0].id_app}`).css('display', 'block');
        setTimeout(() => {
            $(`#${data.ModuleApps[0].id_app}`).removeClass('right');
        }, 10);
    }, 800);
})();