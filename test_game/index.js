'use strict';

var $ = require("jquery");
var GameModel = require('../engine/models/game.js');
var Renderer = require('../engine/views/renderer.js');
var Game = require('../engine/views/game.js');

document.addEventListener("DOMContentLoaded", () => {
    var game_model = new GameModel({});
    var game = new Game({
        model: game_model
    });

    game.run();
});
