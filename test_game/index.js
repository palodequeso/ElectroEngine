'use strict';

var path = require("path");
var $ = require("jquery");
var input = require('../engine/models/input.js');
var GameModel = require('../engine/models/game.js');
var Renderer = require('../engine/views/renderer.js');
var Game = require('../engine/views/game.js');
var gameio = require('../engine/util/gameio.js');

class TestGame extends GameModel {
    constructor(data) {
        super(data);
    }
    update_player(character_instance) {
        var previous_velocity = character_instance.previous_velocity;
        var animation = character_instance.sprite_instance.current_animation;

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

        character_instance.set_velocity_and_animation(velocity, animation);
    }
    game_logic() {
        this.character_instances.each((character_instance) => {
            if (character_instance.id === 'player_character') {
                this.update_player(character_instance);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    var game_loader = new gameio.GameLoader(path.normalize("test_game/data"), TestGame);

    var game = new Game({
        model: game_loader.game
    });

    game.run();
});
