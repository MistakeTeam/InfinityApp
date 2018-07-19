const data = gearbox.Component('data');

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
        if (i >= 2) return;
        let className = "animation-default";
        if (i == 1) {
            className += " right";
        }
        $('.util-app').append(`
            <div id="${v.id}" class="${className}" id-app="${i}"></div>
        `);

        $(`#${v.id}`).append((require(`${__dirname}/${v.module}`)));
    });
})();