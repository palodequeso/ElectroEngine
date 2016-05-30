'use strict';

var fs = require('fs');
var path = require('path');

var Game = require('../models/game.js');
var Maps = require('../models/maps/maps.js');
var Characters = require('../models/characters/characters.js');
var ParticleSystems = require('../models/particle_systems/particle_systems.js');
var SpriteInstance = require('../models/graphics/sprite_instance.js');

class GameLoader {
    constructor(folder_path, game_model) {
        this.folder_path = folder_path;
        this.game = new game_model();
        this.load();
    }
    load() {
        //
    }
}

class GameSaver {
    constructor(folder_path, game_model_instance) {
        this.folder_path = folder_path;
        this.game = game_model_instance;
        this.save();
    }
    save() {
        //
    }
}

function load(folder_path, game_model) {
    if (game_model === undefined) {
        game_model = Game;
    }
    var game_data = JSON.parse(fs.readFileSync(path.normalize(folder_path + '/game.json')));
    var game = new game_model(game_data);

    game.path = folder_path;
    console.log("Game Model: ", game);

    // Hook up sprite sheets to map layers
    game.maps.each((map) => {
        console.log("Map: ", map);
        map.layers.each((layer) => {
            layer.sprite_sheet = null;
            console.log("Map Layer Sprite Sheet ID: ", layer.sprite_sheet_id);
            map.sprite_sheets.each((sprite_sheet) => {
                if (sprite_sheet.id === layer.sprite_sheet_id) {
                    layer.sprite_sheet = sprite_sheet;
                }
            });
        });
    });

    game.sprite_sheets.each((sprite_sheet) => {
        sprite_sheet.sprites.each((sprite) => {
            sprite.sprite_path = sprite_sheet.path;
        });
    });

    // Hook up maps to map instances, and map layers to map layer instances.
    game.map_instances.each((map_instance) => {
        game.maps.each((map) => {
            if (map_instance.map_id === map.id) {
                map_instance.map = map;
                var layer_index = 0;
                map_instance.layer_instances.each((layer_instance) => {
                    map.layers.each((layer) => {
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

        map_instance.character_instances.each((character_instance) => {
            game.characters.each((character) => {
                console.log(character.id, character_instance.character_id);
                if (character.id === character_instance.character_id) {
                    character_instance.character = character;
                }
            });

            game.sprite_sheets.each((sprite_sheet) => {
                sprite_sheet.sprites.each((sprite) => {
                    if (sprite.id === character_instance.character.sprite_id) {
                        character_instance.character.sprite = sprite;
                    }
                });
            });

            // setup sprite instance
            character_instance.sprite_instance = new SpriteInstance({
                position: character_instance.position,
                sprite: character_instance.character.sprite,
                current_animation: character_instance.starting_animation,
                frame_time: 0.0,
                layer: map_instance.map.character_layer_index,
                opacity: 1.0,
                sprite: character_instance.character.sprite,
                tile: character_instance.character.sprite.tiles[0]
            });
            // delete position fron character instance
            delete character_instance.position;
            delete character_instance.starting_animation;
        });
        console.log("Map Instance: ", map_instance);
    });

    game.particle_system_instances.each((particle_system_instance) => {
        game.particle_systems.each((particle_system) => {
            if (particle_system_instance.particle_system_id === particle_system.id) {
                particle_system_instance.particle_system = particle_system;
            }
        });
    });

    // console.log("Finalized: ", game.serialize());

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
