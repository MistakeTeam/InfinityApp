const webview = document.querySelector('webview');

function gotoURL() {
    webview.loadURL(`http://www.${$('#page-url').val()}/`);
}

$('#page-url').keydown(function(event) {
    if (event.which == 13) {
        gotoURL();
    }
});

webview.addEventListener('console-message', (e) => {
    console.log(e.message)
})
webview.addEventListener('page-title-updated', (e, explicitSet) => {
    $('.tab-select').children('span').text(e.title);
})