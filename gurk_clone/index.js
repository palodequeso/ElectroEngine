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
        defaults.gravity = [0.0, 0.0];
        return defaults;
    }
    constructor(data) {
        super(data);
    }
}

class TestGameplaySystem extends GameplaySystem {
    update(frame_time, entities, camera/* , game*/) {
        var camera_velocity = [0, 0];
        var camera_speed = 8 * camera.scale[0];
        if (input.is_keydown(68)) {
            camera_velocity[0] = camera_speed;
        }
        if (input.is_keydown(65)) {
            camera_velocity[0] = -camera_speed;
        }
        if (input.is_keydown(87)) {
            camera_velocity[1] = camera_speed;
        }
        if (input.is_keydown(83)) {
            camera_velocity[1] = -camera_speed;
        }
        camera.position[0] -= camera_velocity[0];// * (frame_time / 1000);
        camera.position[1] -= camera_velocity[1];// * (frame_time / 1000);
        camera.calculate_matrix();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    var game_systems = new Systems();
    game_systems.add(new AudioSystem());
    game_systems.add(new TestGameplaySystem());
    game_systems.add(new GraphicsSystem());
    game_systems.add(new MapSystem());
    game_systems.add(new PhysicsSystem({engine: new TestPhysics()}));
    var game_loader = new gameio.GameLoader(path.normalize("gurk_clone/data"), GameModel, game_systems);

    game_loader.game.camera.resolution = [128, 128];
    game_loader.game.camera.scale = [4, 4];

    game_loader.game.set_current_map_instance('overworld_1_forest');
    var game = new Game({
        model: game_loader.game,
        resolution: [128, 128]
    });
    game.run();
});
