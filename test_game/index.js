'use strict';

var path = require("path");
var $ = require("jquery");
var GameModel = require('../engine/models/game.js');
var Renderer = require('../engine/views/renderer.js');
var Game = require('../engine/views/game.js');
var gameio = require('../editor/gameio.js');

document.addEventListener("DOMContentLoaded", () => {
    // var game_model = new GameModel({});
    var game_model = gameio.load(path.normalize("test_game/data"));
    var game = new Game({
        model: game_model
    });

    game.run();
});
