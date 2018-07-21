const data = gearbox.Component('data');
const widget = gearbox.Component('widget');

(async() => {
    await data.MenuTopbar.forEach((v, i, a) => {
        let className = "menu-item";
        if (v.name == 'Home') className += " active";
        $('.menu-container').append(`
            <div class="${className}" id-menu="${i}"><span>${v.name}</span></div>
        `).click((event) => {
            $('.menu-item').each((index, element) => {
                $(element).removeClass('active');
            });
            $($(event.target).hasClass('menu-item') ? $(event.target) : $(event.target).parent()).addClass('active');
        });
    });

    await data.ModuleApps.forEach((v, i, a) => {
        if (v.module != 'home') return;

        $('.util-app').append(`
            <div id="${v.id}" class="animation-default right" id-app="${i}" style="display: none;"></div>
        `);

        $(`#${v.id}`).append((require(`${__dirname}/${v.module}`)));

        widget.Calendar();

        $(`#${v.id}`).css('display', 'block');
        setTimeout(() => {
            $(`#${v.id}`).removeClass('right');
        }, 10);
    });
})();