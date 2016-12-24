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

var BasicPhysics = require('../engine/models/physics/basic_physics.js');

class TestGameplaySystem extends GameplaySystem {
    update(frame_time, entities, camera, game) {
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
        var click_data = input.is_clicked();
        if (click_data !== null) {
            var map = null;
            var components = game.current_map_instance.components.get_by_index('type', 'map');
            if (components) {
                components.forEach(component => {
                    map = component.map_instance.map;
                });
            }

            if (map !== null && map.collision_layer.tiles_x > 0 && map.collision_layer.tiles_y > 0) {
                var path_data = this.figure_out_path_data([0, 0], click_data, camera, map);
                console.log(path_data);
                // TODO: Path data is incorrect :(, womp
                map.collision_layer.find_path(path_data.start, path_data.end).then(character_path => {
                    console.log("Path: ", character_path);
                });
            }
        }
        camera.position[0] -= camera_velocity[0];// * (frame_time / 1000);
        camera.position[1] -= camera_velocity[1];// * (frame_time / 1000);
        camera.calculate_matrix();
    }
    figure_out_path_data(start_position, mouse_position, camera, map) {
        var start = [
            Math.floor(start_position[0] / map.tile_width),
            map.height - (Math.floor(start_position[1] / map.tile_height))
        ];
        var end = [
            Math.floor((camera.position[0] + mouse_position[0]) / camera.scale[0] / map.tile_width),
            map.height - (Math.floor((camera.position[1] + mouse_position[1]) / camera.scale[1] / map.tile_height))
        ];
        return {start: start, end: end};
    }
}

document.addEventListener("DOMContentLoaded", () => {
    var game_systems = new Systems();
    game_systems.add(new AudioSystem());
    game_systems.add(new TestGameplaySystem());
    game_systems.add(new GraphicsSystem());
    game_systems.add(new MapSystem());
    game_systems.add(new PhysicsSystem({engine: new BasicPhysics(), type: 'basic'}));
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
