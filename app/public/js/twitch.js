let embed, volume = 1,
    muted = false;

function startPlayerTwitch(nameChannel) {
    // https://player.twitch.tv/?volume=1&!muted&channel=fkleague

    $('#twitch-embed').append(`
        <iframe src="https://player.twitch.tv/?volume=${volume}&${muted ? "muted" : "!muted"}&channel=${nameChannel}"></iframe>
    `);

    // embed = new Twitch.Embed("twitch-embed", {
    //     width: 854,
    //     height: 480,
    //     channel: nameChannel,
    //     layout: "video",
    //     autoplay: false
    // });

    // embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
    //     let player = embed.getPlayer();
    //     player.play();
    //     IAPI.init({
    //         state: 'Twitch',
    //         active: true,
    //         details: player.getChannel()
    //     });
    // });

    Twitch.events.addEventListener('auth.login', function() {
        console.log("you're logged in!");
    });
}