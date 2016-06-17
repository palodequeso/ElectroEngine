'use strict';

var path = require("path");
var $ = require("jquery");
var input = require('../engine/models/input.js');
var GameModel = require('../engine/models/game.js');
var Renderer = require('../engine/views/renderer.js');
var Game = require('../engine/views/game.js');
var gameio = require('../engine/util/gameio.js');

var AudioSystem = require('../engine/models/systems/audio.js');
var GameplaySystem = require('../engine/models/systems/gameplay.js');
var GraphicsSystem = require('../engine/models/systems/graphics.js');
var PhysicsSystem = require('../engine/models/systems/physics.js');

var Physics = require('../engine/models/physics/physics.js');

class TestGameplaySystem extends GameplaySystem {
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
    update(frame_time, entities) {
        // This logic should be moved to a custom system.
        entities.each((entity, index) => {
            var components = entity.components.get_by_index('type', 'character');
            if (components) {
                components.forEach((component) => {
                    if (component.character_instance.id === "player_character") {
                        this.update_player(component.character_instance);
                    }
                });
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    var game_loader = new gameio.GameLoader(path.normalize("test_game/data"), GameModel);
    game_loader.game.systems.add(new AudioSystem());
    game_loader.game.systems.add(new TestGameplaySystem());
    game_loader.game.systems.add(new GraphicsSystem());
    game_loader.game.systems.add(new PhysicsSystem({engine: new Physics()}));

    var game = new Game({
        model: game_loader.game
    });

    game.run();
});
