'use strict';

var fs = require('fs');
var path = require('path');

var Game = require('../models/game.js');
var Entity = require('../models/ecs/entity.js');
var Entities = require('../models/ecs/entities.js');
var Components = require('../models/ecs/components.js');
var SpriteComponent = require('../models/components/sprite.js');
var ParticleSystemComponent = require('../models/components/particle_system.js');
var Map = require('../models/maps/map.js');
var Maps = require('../models/maps/maps.js');
var MapLayer = require('../models/maps/map_layer.js');
var MapLayers = require('../models/maps/map_layers.js');
var MapLayerInstance = require('../models/maps/map_layer_instance.js');
var MapLayerInstances = require('../models/maps/map_layer_instances.js');
var MapInstance = require('../models/maps/map_instance.js');
var MapInstances = require('../models/maps/map_instances.js');
var Character = require('../models/characters/character.js');
var BodyComponent = require('../models/components/collision_body.js');
var CharacterComponent = require('../models/components/character.js');
var CharacterInstance = require('../models/characters/character_instance.js');
var CharacterInstances = require('../models/characters/character_instances.js');
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
var Body = require('../models/physics/body.js');
var Bodies = require('../models/physics/bodies.js');
var ShapeBox = require('../models/physics/shape_box.js');
var ShapeCircle = require('../models/physics/shape_circle.js');
var ShapeEdge = require('../models/physics/shape_edge.js');
var ShapePolygon = require('../models/physics/shape_polygon.js');

class GameLoader {
    constructor(folder_path, game_model, systems) {
        this.folder_path = folder_path;
        this.character_body_data = {};
        this.map_bodies = {};
        this.game = new game_model({
            systems: systems,
            sprite_sheets: new SpriteSheets(),
            sprites: new Sprites(),
            characters: new Characters(),
            maps: new Maps(),
            particle_systems: new ParticleSystems(),
            entities: new Entities()
        });
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
    create_body(body_data) {
        if (!body_data) {
            return null;
        }

        var shapes = [];
        body_data.shapes.forEach((shape) => {
            if (shape.type === 'box') {
                var box_shape = new ShapeBox(shape);
                shapes.push(box_shape);
            } else if (shape.type === 'circle') {
                var circle_shape = new ShapeCircle(shape);
                shapes.push(circle_shape);
            } else if (shape.type === 'edge') {
                var edge_shape = new ShapeEdge(shape);
                shapes.push(edge_shape);
            } else if (shape.type === 'polygon') {
                var polygon_shape = new ShapePolygon(shape);
                shapes.push(polygon_shape);
            }
        });
        var body = new Body({
            shapes: shapes,
            mass: body_data.mass,
            is_dynamic: body_data.is_dynamic,
            is_bullet: body_data.is_bullet,
            collision_group: body_data.collision_group,
            collision_rect: body_data.collision_rect
        });
        return body;
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

            if (character.hasOwnProperty('body')) {
                this.character_body_data[character.id] = character.body;
                delete character.body;
            }

            this.game.characters.add(character);
        });
    }
    load_maps() {
        var map_filenames = fs.readdirSync(path.normalize(this.folder_path + '/maps/'));
        map_filenames.forEach((map_filename) => {
            var map_json_path = path.normalize(this.folder_path + '/maps/' + map_filename);
            var map_json = fs.readFileSync(map_json_path);
            var map_data = JSON.parse(map_json);
            this.map_bodies[map_data.id] = [];
            if (map_data.hasOwnProperty('bodies')) {
                map_data.bodies.forEach((body_data) => {
                    console.log("Body Data: ", body_data);
                    this.map_bodies[map_data.id].push(body_data);
                });
                delete map_data.bodies;
            }
            // MapLayers, Characters, SpriteSheets
            var map_layers = new MapLayers();
            map_data.layers.forEach((layer) => {
                // attach sprite_sheet
                this.game.sprite_sheets.each((sprite_sheet) => {
                    if (layer.sprite_sheet_id === sprite_sheet.id) {
                        layer.sprite_sheet = sprite_sheet;
                    }
                });
                var map_layer = new MapLayer(layer);
                map_layers.add(map_layer);
            });
            map_data.layers = map_layers;
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
        var map_instances = [];
        this.game_data.map_instances.forEach((map_instance) => {
            this.game.maps.each((map) => {
                if (map_instance.map_id === map.id) {
                    map_instance.map = map;
                }
            });

            // NOTE: this happens later.
            // map_instance.map_layer_instances = [];//new MapLayerInstances();
            // map_instance.map.layers.each((map_layer) => {
            //     var map_layer_instance = new MapLayerInstance({
            //         map_layer: map_layer
            //     });
            //     map_instance.map_layer_instances.add(map_layer_instance);
            // });

            if (this.map_bodies.hasOwnProperty(map_instance.map.id)) {
                console.log('bodies', this.map_bodies);
                var bodies = [];
                this.map_bodies[map_instance.map.id].forEach((map_body_data) => {
                    var body = this.create_body(map_body_data);
                    bodies.push(body);
                    // NOTE: This happens later.
                    // var entity = new Entity();
                    // entity.components.add(new BodyComponent({
                    //     body: body
                    // }));
                    // this.game.entities.add(entity);
                });
                map_instance.bodies = new Bodies(bodies);
            }

            // NOTE: This happens later.
            // var layer_index = 0;
            // map_instance.layer_instances.forEach((layer_instance, layer_index) => {
            //     map.layers.each((layer) => {
            //         if (layer_instance.map_layer_id === layer.id) {
            //             layer_instance.map_layer = layer;
            //         }
            //     });
            //
            //     // var tile_index = 0;
            //     var layer_width = layer_instance.map_layer.width;
            //     var layer_height = layer_instance.map_layer.height;
            //     layer_instance.map_layer.tiles.forEach((tile_id, tile_index) => {
            //         if (tile_id === -1) {
            //             return;
            //         }
            //
            //         var entity_data = {};
            //         var x = (tile_index % layer_width) * map.tile_width;
            //         var y = (map.tile_height * layer_height) - ((Math.floor(tile_index / layer_width)) * map.tile_height) - map.tile_height;
            //         layer_instance.map_layer.sprite_sheet = this.game.sprite_sheets.get(layer_instance.map_layer.sprite_sheet_id);
            //         var sprite = this.game.sprites.get(tile_id);
            //         var opacity = 1.0;
            //
            //         var sprite_instance = new SpriteInstance({
            //             position: [x, y],
            //             current_animation: '',
            //             frame_time: 0.0,
            //             layer: layer_index,
            //             opacity: opacity,
            //             sprite: sprite,
            //             tile: (!sprite) ? null: sprite.tiles[0]
            //         });
            //
            //         var entity = new Entity();
            //         entity.components.add(new SpriteComponent({
            //             sprite_instance: sprite_instance
            //         }));
            //         this.game.entities.add(entity);
            //         // tile_index += 1;
            //     });
            //
            //     layer_index += 1;
            // });

            // NOTE: This happens later.
            // var character_instances = [];
            // map_instance.character_instances.forEach((character_instance) => {
            //     this.game.characters.each((character) => {
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
            //     //character_instance.sprite_instance = new SpriteInstance({
            //     var sprite_instance = new SpriteInstance({
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
            //
            //     var new_character_instance = new CharacterInstance(character_instance);
            //     new_character_instance.sprite_instance = sprite_instance;
            //     var body = this.create_body(this.character_body_data[character_instance.character.id]);
            //     character_instance.body = body;
            //
            //     // var entity = new Entity();
            //     // entity.components.add(new SpriteComponent({
            //     //     sprite_instance: sprite_instance
            //     // }));
            //     // entity.components.add(new CharacterComponent({
            //     //     character_instance: new_character_instance
            //     // }));
            //     // if (body) {
            //     //     body.position[0] = sprite_instance.position[0];
            //     //     body.position[1] = sprite_instance.position[1];
            //     //     entity.components.add(new BodyComponent({
            //     //         body: body
            //     //     }));
            //     // }
            //     // this.game.entities.add(entity);
            // });
            // map_instance.character_instances = new CharacterInstances(character_instances);
            // console.log("Map Instance: ", map_instance);
            map_instances.push(map_instance);
        });
        this.game.map_instances = new MapInstances(map_instances);
    }
    load_character_instances() {
        this.game_data.character_instances.forEach((character_instance) => {
            console.log("Character Instance: ", character_instance);
            this.game.characters.each((character) => {
                if (character.id === character_instance.character_id) {
                    character_instance.character = character;
                }
            });

            this.game.sprites.each((sprite) => {
                if (sprite.id === character_instance.character.sprite_id) {
                    character_instance.character.sprite = sprite;
                }
            });

            // setup sprite instance
            //character_instance.sprite_instance = new SpriteInstance({
            var sprite_instance = new SpriteInstance({
                position: character_instance.position,
                sprite: character_instance.character.sprite,
                current_animation: character_instance.starting_animation,
                frame_time: 0.0,
                // TODO: This should be set when a map instance is loaded.
                layer: 10,//map_instance.map.character_layer_index,
                opacity: 1.0,
                sprite: character_instance.character.sprite,
                tile: character_instance.character.sprite.tiles[0]
            });
            // delete position fron character instance
            delete character_instance.position;
            delete character_instance.starting_animation;

            var new_character_instance = new CharacterInstance(character_instance);
            new_character_instance.sprite_instance = sprite_instance;

            var body = this.create_body(this.character_body_data[character_instance.character.id]);

            var entity = new Entity();
            entity.components = new Components();
            entity.components.add(new SpriteComponent({
                sprite_instance: sprite_instance
            }));
            entity.components.add(new CharacterComponent({
                character_instance: new_character_instance
            }));
            if (body) {
                entity.components.add(new BodyComponent({
                    body: body
                }));
            }
            this.game.entities.add(entity);
        });
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

module.exports = {
    GameLoader: GameLoader,
    GameSaver: GameSaver
};
