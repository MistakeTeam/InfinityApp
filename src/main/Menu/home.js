const widget = gearbox.Component('widget');

let append = $('<div class="home-over" style="height: 100%;"><div class="widget-collections" style="height: 100%;"></div></div>');

widget.Calendar(append.children('.widget-collections'));

module.exports = append