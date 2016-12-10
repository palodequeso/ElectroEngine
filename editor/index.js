'use strict';

var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
var App = require('./views/app.js');

Handlebars.registerHelper('times', function(n, block) {
    console.log("Times: ", n);
    var i = 0;
    var accum = '';
    for (i = 0; i < n; i += 1) {
        accum += block.fn(i);
    }
    return accum;
});

document.addEventListener("DOMContentLoaded", () => {
    var preload_game_path = null;
    try {
        var config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), 'utf-8'));
        if (config.hasOwnProperty('preload_game_path')) {
            preload_game_path = config.preload_game_path;
        }
    } catch (e) {
        console.warn("No config file found in root dir!", e);
    }

    var titlebar = new hx.TitleBar('.heading');
    var sidebar = new hx.Sidebar('.hx-sidebar'/*, {
        headerSelector: '.titlebar',
        contentSelector: '.content',
        autoAddSidebarClass: false
    }*/);

    var app = new App({
        element: document.querySelector('body'),
        preload_game_path: preload_game_path
    });
    app.render();
});
