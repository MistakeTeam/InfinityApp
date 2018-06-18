let lang_json = {},
    lang, lang_path;

if (dev()) {
    lang_path = path.resolve(process.cwd(), './lang/');
} else {
    lang_path = path.resolve(process.cwd(), './resources/app.asar/lang/');
}

fs.readdir(lang_path, (err, files) => {
    for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        if (lang_json[files[i]] == (undefined || null)) {
            fs.readFile(`${lang_path}/${files[i]}`, (err, data) => {
                let filename = files[i].replace('.json', '');
                lang_json[filename] = JSON.parse(data);
            });
        }
    }
    console.log(lang_json);
});

async function getLang() {
    return lang_json[optionData.options.lang ? optionData.options.lang : "pt-br"];
}

async function reloadLang() {
    console.log(`[reloadLang] Verificando linguagem...`);
    lang = await getLang();

    //start Menu
    await $('#item_menu_games_name').parent().parent().attr('title', lang.item_menu_games_name);
    await $('#item_menu_player_name').parent().parent().attr('title', lang.item_menu_player_name);
    await $('#item_menu_twitch_name').parent().parent().attr('title', lang.item_menu_twitch_name);
    await $('#item_menu_Text_Editor').parent().parent().attr('title', lang.item_menu_Text_Editor);
    await $('#item_menu_calendar_name').parent().parent().attr('title', lang.item_menu_calendar_name);
    await $('#item_menu_options_name').parent().parent().attr('title', lang.item_menu_options_name);
    //end Menu

    //start Statusbar
    await $('.statusbar-item').each((i, e) => {
        if ($(e).attr('status-type') == "notifications") {
            $(e).attr('title', lang.statusbar_item_notifications_title)
        }
    });
    //end Statusbar
}