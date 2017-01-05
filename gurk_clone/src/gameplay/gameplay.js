'use strict';

const GameplaySystem = require('../../../engine/models/systems/gameplay.js');
const input = require('../../../engine/models/input.js');

const CameraControl = require('./camera_control.js');
const Party = require('./party.js');
const Quests = require('./quests.js');

class RPGGameplaySystem extends GameplaySystem {
    constructor() {
        super();

        this.character_entity = null;
        this.character_instance = null;

        this.camera_control = new CameraControl();
        this.party = new Party();
        this.quests = new Quests();
    }
    new_game(root_directory) {
        this.quests.reset(JSON.parse(fs.readFileSync(path.normalize(
            path.join(root_directory, 'data', 'quests.json')), 'utf-8')));
        console.log(this.quests.serialize());
    }
    continue_game(root_directory) {
        //
    }
    save_game(root_directory) {
        //
    }
    update(frame_time, entities, camera, game) {
        if (this.character_entity === null) {
            entities.each(entity => {
                let found = false;
                const components = entity.components.get_by_index('type', 'character');
                if (components && !found) {
                    components.forEach(component => {
                        if (component.character_instance.id === 'player_character') {
                            this.character_entity = entity;
                            this.character_instance = component.character_instance;
                            console.log("CI: ", component.character_instance);
                            found = true;
                        }
                    });
                }
            });
        }

        const map_instance = game.map_instance;

        this.camera_control.update(frame_time, camera);

        const click_data = input.is_clicked();
        if (click_data !== null) {
            let map = null;
            const components = game.current_map_instance.components.get_by_index('type', 'map');
            if (components) {
                components.forEach(component => {
                    map = component.map_instance.map;
                });
            }

            if (map !== null && map.collision_layer.tiles_x > 0 && map.collision_layer.tiles_y > 0) {
                const position = this.character_instance.sprite_instance.position;
                const path_data = this.figure_out_path_data(position, click_data, camera, map);
                console.log(path_data);
                // TODO: Path data is incorrect :(, womp
                map.collision_layer.find_path(path_data.start, path_data.end).then(character_path => {
                    console.log("Path: ", character_path);
                    if (character_path === null) {
                        return;
                    }

                    const last_tile = character_path[character_path.length - 1];
                    this.character_instance.sprite_instance.position = [
                        last_tile.x * map_instance.map.tile_width,
                        (map_instance.map.height - last_tile.y - 1) * map_instance.map.tile_height
                    ];
                    console.log(last_tile, this.character_instance.sprite_instance.position);
                });
            }
        }
    }
    figure_out_path_data(start_position, mouse_position, camera, map) {
        const start = [
            Math.floor(start_position[0] / map.tile_width),
            map.height - (Math.floor(start_position[1] / map.tile_height)) - 1
        ];

        const mpx = mouse_position[0];
        const mpy = (camera.resolution[1] * camera.scale[1]) - mouse_position[1];
        const end = [
            Math.floor((-camera.position[0] + mpx) / camera.scale[0] / map.tile_width),
            map.height - (Math.floor((-camera.position[1] + mpy) / camera.scale[1] / map.tile_height)) - 1
        ];
        return {start: start, end: end};
    }
}

module.exports = RPGGameplaySystem;
