/*
 * jQuery appear plugin
 *
 * Copyright (c) 2012 Andrey Sidorov
 * licensed under MIT license.
 *
 * https://github.com/morr/jquery.appear/
 *
 * Version: 0.3.6
 */
(function($) {
    function load() {
        var sla = $('#oaoao');
        var value = 0;
        setInterval(function() {
            if (value >= 180) {
                value = 0;
            } else {
                value += Math.random() * 0.5;
            }
            sla.css('background-image', `linear-gradient(${value}deg, #ee470f, #ee3860, #b86bee, #3273dc, #1ade93, #eed112) !important`);
        });
        console.log(sla);
    }
})(function() {
    if (typeof module !== 'undefined') {
        // Node
        return require('jquery');
    } else {
        return jQuery;
    }
}());