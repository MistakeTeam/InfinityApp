const { gamesDB } = gearbox.Component('Database'),
    games = gamesDB.get('games').value();

let append = $(`<div class="home-over" style="height: 100%;"><div class="games-options default-animation"><div class="games-options-add"></div></div><div class="games-H5wY75"></div></div>`);
console.log(append)
if ($(append).children('.games-H5wY75').children('.game-item-T5e87d').length != 0) {
    $(append).children('.games-H5wY75').children('.game-item-T5e87d').remove();
}

// $(append).children('.games-H5wY75').scroll(function(){
// 	var scrollTop = $(append).children('.games-H5wY75').scrollTop();
//   if(scrollTop >= $(append).children('.games-H5wY75').children('.game-item-T5e87d').offset().top){
//     $(append).children('.games-H5wY75').css('-webkit-mask', 'linear-gradient(180deg, rgba(255, 255, 255, 0) 3%, rgb(255, 255, 255) 8%)');
//   }else{
//     $(append).children('.games-H5wY75').css('-webkit-mask', 'linear-gradient(0deg, rgba(255, 255, 255, 0) 3%, rgb(255, 255, 255) 8%)');
//   }
// })

for (let i = 0; i < games.length; i++) {
    $(append).children('.games-H5wY75').append(`
        <div class="game-item-T5e87d" path="${games[i].path}" index="${i}">
            <img src="base/games/Icons/${games[i].thumb}" alt=""></img>
            <div class="game-playany">Jogar</div>
        </div>
    `);
}

$('.game-playany').click((event) => {
    switch (event.which) {
        case 1:
            var pathg = $(this).parent().attr('path') ? $(this).parent().attr('path').split('\\') : $(this).parent().parent().attr('path').split('\\'),
                index = $(this).parent().attr('index') ? $(this).parent().attr('index') : $(this).parent().parent().attr('index'),
                Rpath = "";

            for (var i = 0; i < pathg.length - 1; i++) {
                Rpath += `${pathg[i]}\\`;
            }
            process.chdir(Rpath);

            console.log(`[Games] executando: ${Rpath}${pathg[pathg.length-1]}`);
            child.execFile(`./${pathg[pathg.length-1]}`, function(error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                    return;
                }
                console.log('exec stdout: ' + stdout);
                console.log('exec stderr: ' + stderr);
            });
            console.log('Left Mouse button pressed.');
            break;
        default:
            console.log('You have a strange Mouse!');
    }
})

module.exports = append