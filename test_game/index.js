'use strict';

var path = require("path");
var input = require('../engine/models/input.js');
var GameModel = require('../engine/models/game.js');
var Game = require('../engine/views/game.js');
var gameio = require('../engine/util/gameio.js');

var AudioSystem = require('../engine/models/systems/audio.js');
var GameplaySystem = require('../engine/models/systems/gameplay.js');
var GraphicsSystem = require('../engine/models/systems/graphics.js');
var MapSystem = require('../engine/models/systems/map.js');
var PhysicsSystem = require('../engine/models/systems/physics.js');
var Systems = require('../engine/models/ecs/systems.js');

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
            body.body.velocity[0] = velocity[0] * 1.5;
            if (!character_instance.is_jumping && jump) {
                body.body.applyImpulse([0, 100]);
                character_instance.is_jumping = true;
            }
        }
    }
    update(frame_time, entities, camera, game) {
        // This logic should be moved to a custom system.
        entities.each(entity => {
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

        if (input.is_keydown(79)) {
            game.set_current_map_instance('test_area_2');
        }

        // camera.position[0] += -10 * (frame_time / 1000);
        camera.calculate_matrix();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    var game_systems = new Systems();
    console.log(game_systems);
    game_systems.add(new AudioSystem());
    game_systems.add(new TestGameplaySystem());
    game_systems.add(new GraphicsSystem());
    game_systems.add(new MapSystem());
    game_systems.add(new PhysicsSystem({engine: new TestPhysics()}));
    console.log("DOOM");
    var game_loader = new gameio.GameLoader(path.normalize("test_game/data"), GameModel, game_systems);
    console.log("HERE?");

    game_loader.game.set_current_map_instance('test_area');
    var game = new Game({
        model: game_loader.game
    });

    game.run();
});
