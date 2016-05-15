'use strict';

var fs = require('fs');
var path = require('path');

var Game = require('../engine/models/game.js');
var Maps = require('../engine/models/maps.js');
var Entities = require('../engine/models/entities.js');
var ParticleSystems = require('../engine/models/particle_systems.js');

function load(folder_path) {
    var game_data = JSON.parse(fs.readFileSync(path.normalize(folder_path + '/game.json')));
    var game = new Game(game_data);

    game.path = folder_path;
    console.log("Game Model: ", game);

    // Hook up sprite sheets to map layers
    game.maps.models.forEach((map) => {
        console.log("Map: ", map);
        map.layers.models.forEach((layer) => {
            layer.sprite_sheet = null;
            console.log("Map Layer Sprite Sheet ID: ", layer.sprite_sheet_id);
            map.sprite_sheets.models.forEach((sprite_sheet) => {
                if (sprite_sheet.id === layer.sprite_sheet_id) {
                    layer.sprite_sheet = sprite_sheet;
                }
            });
        });
    });

    // Hook up maps to map instances, and map layers to map layer instances.
    game.map_instances.models.forEach((map_instance) => {
        game.maps.models.forEach((map) => {
            if (map_instance.map_id === map.id) {
                map_instance.map = map;
                var layer_index = 0;
                map_instance.layer_instances.models.forEach((layer_instance) => {
                    map.layers.models.forEach((layer) => {
                        if (layer_instance.map_layer_id === layer.id) {
                            layer_instance.map_layer = layer;
                        }
                    });

                    // var tile_index = 0;
                    var layer_width = layer_instance.map_layer.width;
                    var layer_height = layer_instance.map_layer.height;
                    layer_instance.map_layer.tiles.forEach((tile_id, tile_index) => {
                        if (tile_id === -1) {
                            return;
                        }
                        var x = (tile_index % layer_width) * map.tile_width;
                        var y = (Math.floor(tile_index / layer_width)) * map.tile_height;
                        var sprite = layer_instance.map_layer.sprite_sheet.sprites.get(tile_id);
                        var opacity = 1.0;
                        layer_instance.sprite_instances.add({
                            position: [x, y],
                            current_animation: '',
                            frame_time: 0.0,
                            layer: layer_index,
                            opacity: opacity,
                            sprite: sprite,
                            tile: (!sprite) ? null: sprite.tiles[0]
                        });
                        // tile_index += 1;
                    });

                    layer_index += 1;
                });
            }
        });
        console.log("Map Instance: ", map_instance);
    });

    console.log("Finalized: ", game.serialize());

    return game;
}

function save(game_model) {
    var game_data = game_model.serialize();
    console.log("Saved Game Data: ", game_data);
    fs.writeFileSync(path.normalize(path.join(game_data.path, 'game.json')), JSON.stringify(game_data));
}

module.exports = {
    load: load,
    save: save
};
