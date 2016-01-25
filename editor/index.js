'use strict';

var $ = require('jquery');

var game_model = require('../engine/models/game.js');
var game_view = require('./views/game.js');
var fs = require('fs');

document.addEventListener("DOMContentLoaded", () => {
    var titlebar = new hx.TitleBar('.heading');
    var sidebar = new hx.Sidebar('.hx-sidebar');

    $("#create_game_button").on('click', () => {
        console.log("Game Button Clicked!");
    });

    var gv = new game_view({
        model: new game_model()
    });
    gv.render();

    $(".content").empty();
    $(".content").append(gv.$element);
});
