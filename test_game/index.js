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

                var previous_velocity = entity_instance.previous_velocity;
                var animation = entity_instance.sprite_instance.current_animation;

                var velocity = [0.0, 0.0];
                if (input.is_keydown(87)) {
                    velocity[1] -= 1.0;
                    animation = "walk_up";
                }
                if (input.is_keydown(83)) {
                    velocity[1] += 1.0;
                    animation = "walk_down";
                }
                if (input.is_keydown(68)) {
                    velocity[0] += 1.0;
                    animation = "walk_right";
                }
                if (input.is_keydown(65)) {
                    velocity[0] -= 1.0;
                    animation = "walk_left";
                }

                if (velocity[0] === 0.0 && velocity[1] === 0.0) {
                    if (previous_velocity[0] < 0) {
                        animation = "idle_left";
                    }
                    if (previous_velocity[0] > 0) {
                        animation = "idle_right";
                    }
                    if (previous_velocity[1] < 0) {
                        animation = "idle_up";
                    }
                    if (previous_velocity[1] > 0) {
                        animation = "idle_down";
                    }
                }

                entity_instance.set_velocity_and_animation(velocity, animation);
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
