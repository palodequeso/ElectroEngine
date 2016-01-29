'use strict';

var remote = require('remote');
var dialog = remote.require('dialog');

var fs = require('fs');

var $ = require('jquery');
var game_model = require('../engine/models/game.js');
var game_view = require('./views/game.js');

document.addEventListener("DOMContentLoaded", () => {
    var titlebar = new hx.TitleBar('.heading');
    var sidebar = new hx.Sidebar('.hx-sidebar');

    $("#create_game_button").on('click', () => {
        console.log("Game Button Clicked!");
        var gv = new game_view({
            model: new game_model()
        });
        gv.render();

        $(".content").empty();
        $(".content").append(gv.$element);
    });

    $("#load_game_button").on('click', () => {
        var choice = dialog.showOpenDialog({properties: ['openDirectory']});
        console.log("Game Folder: ", choice);
    });

});
