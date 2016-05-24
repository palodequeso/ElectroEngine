'use strict';

var path = require("path");
var $ = require("jquery");
var input = require('../engine/models/input.js');
var GameModel = require('../engine/models/game.js');
var Renderer = require('../engine/views/renderer.js');
var Game = require('../engine/views/game.js');
var gameio = require('../editor/gameio.js');

class TestGame extends GameModel {
    constructor(data) {
        super(data);
    }
    game_logic() {
        this.map_instances.each((map_instance) => {
            map_instance.entity_instances.each((entity_instance) => {
                if (entity_instance.id !== 'test_entity_instance1') {
                    return;
                }

                var velocity = [0.0, 0.0];
                if (input.is_keydown(87)) {
                    velocity[1] -= 1.0;
                }
                if (input.is_keydown(83)) {
                    velocity[1] += 1.0;
                }
                if (input.is_keydown(68)) {
                    velocity[0] += 1.0;
                }
                if (input.is_keydown(65)) {
                    velocity[0] -= 1.0;
                }

                entity_instance.set_velocity_and_animation(velocity, 'walk_up');
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // var game_model = new GameModel({});
    var game_model = gameio.load(path.normalize("test_game/data"), TestGame);
    var game = new Game({
        model: game_model
    });

    game.run();
});
