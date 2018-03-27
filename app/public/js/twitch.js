let embed = new Twitch.Embed("twitch-embed", {
    width: 854,
    height: 480,
    channel: "monstercat",
    layout: "video",
    autoplay: false
});

embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
    let player = embed.getPlayer();
    player.play();
    IAPI.init({
        state: 'Twitch',
        active: true,
        details: player.getChannel()
    });
});

embed.addEventListener(Twitch.Embed.AUTHENTICATE, function(user) {
    console.log(user.login + ' just logged in');
});