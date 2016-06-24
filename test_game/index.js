'use strict';

var path = require("path");
var $ = require("jquery");
var input = require('../engine/models/input.js');
var GameModel = require('../engine/models/game.js');
var Renderer = require('../engine/views/renderer.js');
var Game = require('../engine/views/game.js');
var gameio = require('../engine/util/gameio.js');

var p2 = require('p2');
var AudioSystem = require('../engine/models/systems/audio.js');
var GameplaySystem = require('../engine/models/systems/gameplay.js');
var GraphicsSystem = require('../engine/models/systems/graphics.js');
var PhysicsSystem = require('../engine/models/systems/physics.js');

var RigidBodyPhysics = require('../engine/models/physics/rigid_body_physics.js');

class TestPhysics extends RigidBodyPhysics {
    get defaults() {
        var defaults = super.defaults;
        defaults.gravity = [0.0, -5.0];
        return defaults;
    }
    constructor(data) {
        super(data);
    }
}

class TestGameplaySystem extends GameplaySystem {
    update_player(character_instance, body) {
        var previous_velocity = character_instance.previous_velocity;
        var animation = character_instance.sprite_instance.current_animation;

        var velocity = [0.0, 0.0];
        var jump = false;

        if (input.is_keydown(68)) {
            velocity[0] += 1.0;
            animation = "walk_right";
        }
        if (input.is_keydown(65)) {
            velocity[0] -= 1.0;
            animation = "walk_left";
        }
        if (input.is_keydown(32)) {
            jump = true;
        }

        if (velocity[0] === 0.0 && velocity[1] === 0.0) {
            if (previous_velocity[0] < 0) {
                animation = "idle_left";
            }
            if (previous_velocity[0] > 0) {
                animation = "idle_right";
            }
        }

        character_instance.set_velocity_and_animation(velocity, animation);
        if (body.body) {
            if (body.body.velocity[1] < 0.001 && body.body.velocity[1] > -0.001) {
                // NOTE: This is a hack, and is no way to do it. You should check
                // collision results to determine this. So many reasons!
                character_instance.is_jumping = false;
            }
            body.body.velocity[0] = velocity[0] * 2.0;
            if (!character_instance.is_jumping && jump) {
                body.body.applyImpulse([0, 150]);
                character_instance.is_jumping = true;
            }
        }
    }
    update(frame_time, entities) {
        // This logic should be moved to a custom system.
        entities.each((entity, index) => {
            var character_instance = null;
            var components = entity.components.get_by_index('type', 'character');
            if (components) {
                components.forEach((component) => {
                    if (component.character_instance.id === "player_character") {
                        character_instance = component.character_instance;
                    }
                });
            }

            if (character_instance) {
                components = entity.components.get_by_index('type', 'collision_body');
                if (components) {
                    var body = null;
                    components.forEach((component) => {
                        if (!body) {
                            body = component.body;
                        }
                    });
                    if (body) {
                        this.update_player(character_instance, body);
                    }
                }
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    var game_loader = new gameio.GameLoader(path.normalize("test_game/data"), GameModel);
    game_loader.game.systems.add(new AudioSystem());
    game_loader.game.systems.add(new TestGameplaySystem());
    game_loader.game.systems.add(new GraphicsSystem());
    game_loader.game.systems.add(new PhysicsSystem({engine: new TestPhysics()}));

    var game = new Game({
        model: game_loader.game
    });

    game.run();
});
