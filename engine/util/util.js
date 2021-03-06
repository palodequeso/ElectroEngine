"use strict";

var wait = function(statuses, callback, max_iterations, interval_time) {
    if (max_iterations === undefined) {
        max_iterations = 50;
    }
    if (interval_time === undefined) {
        interval_time = 100;
    }

    var iteration = 0;
    var interval = setInterval(function() {
        var is_done = true;
        Object.keys(statuses).forEach((status_key) => {
            if (!statuses[status_key]) {
                is_done = false;
            }
        });

        if (is_done || iteration >= max_iterations) {
            clearInterval(interval);
            callback();
        }

        iteration += 1;
    }, interval_time);
};

var rand_range = function(min, max) {
    return Math.random() * (max - min) + min;
};

var hex_to_rgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
};

// http://stackoverflow.com/questions/16493645/javascript-equivalent-of-jquerys-keyup-and-keydown
// http://blog.garstasio.com/you-dont-need-jquery/events/
var add_event = function(element, event_name, callback) {
    if (element.addEventListener) {
        element.addEventListener(event_name, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + event_name, callback);
    }
}

module.exports = {
    wait: wait,
    rand_range: rand_range,
    hex_to_rgb: hex_to_rgb,
    add_event: add_event
};
