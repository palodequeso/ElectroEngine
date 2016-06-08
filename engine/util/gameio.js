'use strict';

var fs = require('fs');
var path = require('path');

var Game = require('../models/game.js');
var Entity = require('../models/ecs/entity.js');
var SpriteComponent = require('../models/components/sprite.js');
var ParticleSystemComponent = require('../models/components/particle_system.js');
var Map = require('../models/maps/map.js');
var Maps = require('../models/maps/maps.js');
var Character = require('../models/characters/character.js');
var Characters = require('../models/characters/characters.js');
var ParticleSystems = require('../models/particle_systems/particle_systems.js');
var ParticleSystem = require('../models/particle_systems/particle_system.js');
var ParticleSystemInstance = require('../models/particle_systems/particle_system_instance.js');
var SpriteInstance = require('../models/graphics/sprite_instance.js');
var SpriteSheet = require('../models/graphics/sprite_sheet.js');
var SpriteSheets = require('../models/graphics/sprite_sheets.js');
var Sprite = require('../models/graphics/sprite.js');
var Sprites = require('../models/graphics/sprites.js');
var Character = require('../models/characters/character.js');

class GameLoader {
    constructor(folder_path, game_model) {
        this.folder_path = folder_path;
        this.game = new game_model();
        this.game_data = null;
        this.load();
    }
    create_sprite(sprite_data) {
        var sprite = new Sprite(sprite_data);
        this.game.sprite_sheets.each((sprite_sheet) => {
            if (sprite.sprite_sheet_id === sprite_sheet.id) {
                sprite.sprite_sheet = sprite_sheet;
            }
        });
        this.game.sprites.add(sprite);
    }
    load_sprite_sheets() {
        var sprite_sheet_filenames = fs.readdirSync(path.normalize(this.folder_path + '/sprite_sheets/'));
        sprite_sheet_filenames.forEach((sprite_sheet_filename) => {
            var sprite_sheet = new SpriteSheet(JSON.parse(fs.readFileSync(
                path.normalize(this.folder_path + '/sprite_sheets/' +
                               sprite_sheet_filename, 'utf-8'))));
            this.game.sprite_sheets.add(sprite_sheet);
        });
    }
    load_sprites() {
        var sprite_filenames = fs.readdirSync(path.normalize(this.folder_path + '/sprites/'));
        sprite_filenames.forEach((sprite_filename) => {
            var sprite_data = JSON.parse(fs.readFileSync(path.normalize(
                this.folder_path + '/sprites/' + sprite_filename), 'utf-8'));
            if (Array.isArray(sprite_data)) {
                sprite_data.forEach((entry) => {
                    this.create_sprite(entry);
                });
            } else {
                this.create_sprite(sprite_data);
            }
        });
    }
    load_characters() {
        var characters_filenames = fs.readdirSync(path.normalize(this.folder_path + '/characters/'));
        characters_filenames.forEach((characters_filename) => {
            var character = new Character(JSON.parse(fs.readFileSync(
                path.normalize(this.folder_path + '/characters/' +
                               characters_filename), 'utf-8')));
            this.game.sprites.each((sprite) => {
                if (character.sprite_id === sprite.id) {
                    character.sprite = sprite;
                }
            });
            this.game.characters.add(character);
        });
    }
    load_maps() {
        var map_filenames = fs.readdirSync(path.normalize(this.folder_path + '/maps/'));
        map_filenames.forEach((map_filename) => {
            var map_json_path = path.normalize(this.folder_path + '/maps/' + map_filename);
            var map_json = fs.readFileSync(map_json_path);
            var map_data = JSON.parse(map_json);
            var map = new Map(map_data);
            this.game.maps.add(map);
        });
    }
    load_particle_systems() {
        var particle_system_filenames = fs.readdirSync(path.normalize(this.folder_path + '/particle_systems/'));
        particle_system_filenames.forEach((particle_system_filename) => {
            var particle_system = new ParticleSystem(JSON.parse(fs.readFileSync(
                path.normalize(this.folder_path + '/particle_systems/' +
                particle_system_filename))));
            this.game.particle_systems.add(particle_system);
        });
    }
    load_game_data() {
        var game_json = fs.readFileSync(path.normalize(this.folder_path + '/game.json'), 'utf-8');
        this.game_data = JSON.parse(game_json);
    }
    load_map_instances() {
        this.game_data.map_instances.forEach((map_instance) => {
            this.game.maps.each((map) => {
                if (map_instance.map_id === map.id) {
                    map_instance.map = map;
                    var layer_index = 0;
                    map_instance.layer_instances.forEach((layer_instance, layer_index) => {
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

                            var entity_data = {};
                            var x = (tile_index % layer_width) * map.tile_width;
                            var y = (Math.floor(tile_index / layer_width)) * map.tile_height;
                            layer_instance.map_layer.sprite_sheet = this.game.sprite_sheets.get(layer_instance.map_layer.sprite_sheet_id);
                            var sprite = this.game.sprites.get(tile_id);
                            var opacity = 1.0;

                            var sprite_instance = new SpriteInstance({
                                position: [x, y],
                                current_animation: '',
                                frame_time: 0.0,
                                layer: layer_index,
                                opacity: opacity,
                                sprite: sprite,
                                tile: (!sprite) ? null: sprite.tiles[0]
                            });

                            var entity = new Entity();
                            entity.components.add(new SpriteComponent({
                                sprite_instance: sprite_instance
                            }));
                            this.game.entities.add(entity);
                            // tile_index += 1;
                        });

                        layer_index += 1;
                    });
                }
            });

            // map_instance.character_instances.each((character_instance) => {
            //     this.game.characters.each((character) => {
            //         console.log(character.id, character_instance.character_id);
            //         if (character.id === character_instance.character_id) {
            //             character_instance.character = character;
            //         }
            //     });
            //
            //     this.game.sprite_sheets.each((sprite_sheet) => {
            //         sprite_sheet.sprites.each((sprite) => {
            //             if (sprite.id === character_instance.character.sprite_id) {
            //                 character_instance.character.sprite = sprite;
            //             }
            //         });
            //     });
            //
            //     // setup sprite instance
            //     character_instance.sprite_instance = new SpriteInstance({
            //         position: character_instance.position,
            //         sprite: character_instance.character.sprite,
            //         current_animation: character_instance.starting_animation,
            //         frame_time: 0.0,
            //         layer: map_instance.map.character_layer_index,
            //         opacity: 1.0,
            //         sprite: character_instance.character.sprite,
            //         tile: character_instance.character.sprite.tiles[0]
            //     });
            //     // delete position fron character instance
            //     delete character_instance.position;
            //     delete character_instance.starting_animation;
            // });
            // console.log("Map Instance: ", map_instance);
        });
    }
    load_character_instances() {
        //
    }
    load_particle_system_instances() {
        this.game_data.particle_system_instances.forEach((particle_system_instance) => {
            this.game.particle_systems.each((particle_system) => {
                if (particle_system_instance.particle_system_id === particle_system.id) {
                    particle_system_instance.particle_system = particle_system;
                }
            });

            var new_particle_system_instance = new ParticleSystemInstance(
                particle_system_instance);

            var entity = new Entity();
            entity.components.add(new ParticleSystemComponent({
                particle_system_instance: new_particle_system_instance
            }));
            this.game.entities.add(entity);
        });
    }
    load() {
        this.load_sprite_sheets();
        this.load_sprites();
        this.load_characters();
        this.load_maps();
        this.load_particle_systems();
        this.load_game_data();
        this.load_map_instances();
        this.load_character_instances();
        this.load_particle_system_instances();
        console.log(this.game);
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
    save: save,
    GameLoader: GameLoader,
    GameSaver: GameSaver
};
