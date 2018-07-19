/**
 * @param {Electron} Electon 
 */
module.exports = ({ app, remote }) => {
    $('.win-minimize')
        .click(function(e) {
            remote.getCurrentWindow().minimize();
        });
    $('.win-maximize')
        .click(function(e) {
            remote.getCurrentWindow().isMaximized() ? remote.getCurrentWindow().restore() : remote.getCurrentWindow().maximize()
        });
    $('.win-close')
        .click(function(e) {
            // remote.getCurrentWindow().isVisible() ? remote.getCurrentWindow().hide() : remote.getCurrentWindow().show();
        });
}