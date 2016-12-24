'use strict';

var Model = require('exo').Model;

var gameio = require('../util/gameio.js');

var input = require('./input.js');
var Maps = require('./maps/maps.js');
var CharacterInstance = require('./characters/character_instance.js');
var Characters = require('./characters/characters.js');
var Sprites = require('./graphics/sprites.js');
var SpriteSheets = require('./graphics/sprite_sheets.js');
var SpriteInstance = require('./graphics/sprite_instance.js');
var ParticleSystems = require('./particle_systems/particle_systems.js');
var Entities = require('./ecs/entities.js');
var Entity = require('./ecs/entity.js');
var Systems = require('./ecs/systems.js');
var Camera = require('./graphics/camera.js');
var MapInstances = require('./maps/map_instances.js');
var MapInstance = require('./maps/map_instance.js');
var MapComponent = require('./components/map.js');
var SpriteComponent = require('./components/sprite.js');
var BodyComponent = require('./components/collision_body.js');
var CharacterComponent = require('./components/character.js');

class Game extends Model {
    get defaults() {
        return {
            path: '',
            name: '',
            description: '',
            version: 0,
            maps: null,
            characters: null,
            sprites: null,
            sprite_sheets: null,
            particle_systems: null,
            entities: null,
            systems: null,
            camera: null,
            current_map_instance: null,
            map_instances: null,
            map_transition_type: 'warp' // also increment 'render', ''
        };
    }
    get types() {
        return {
            maps: Maps,
            characters: Characters,
            sprites: Sprites,
            sprite_sheets: SpriteSheets,
            particle_systems: ParticleSystems,
            entities: Entities,
            systems: Systems,
            camera: Camera,
            map_instances: MapInstances,
            current_map_instance: Entity
        };
    }
    get collision_layer() {
        var out = null;
        var components = current_map_instance.components.get_by_index('type', 'map');
        if (components) {
            components.forEach(component => {
                var cl = component.map_instance.map.collision_layer;
                if (cl.tiles_x >= 0 && cl.tiles_y >= 0) {
                    out = cl;
                }
            });
        }
        return out;
    }
    constructor(data) {
        super(data);
        this.systems.sort();
    }
    set_current_map_instance(id, force) {
        if (force === undefined) {
            force = false;
        }

        if (force || (this.current_map_instance && this.current_map_instance.map_instance
            && id === this.current_map_instance.map_instance.id)) {
            return;
        }

        // NOTE: This only allows one map to be viewed at a time, so we'll have to work on that.
        if (this.current_map_instance.map_instance) {
            this.current_map_instance.map_instance.character_instances.each(character_instance => {
                if (character_instance.entity) {
                    this.entities.remove(character_instance.entity);
                    character_instance.entity = null;
                }
            });

            this.current_map_instance.map_instance.bodies.each(body => {
                if (body.entity) {
                    this.entities.remove(body.entity);
                    body.entity = null;
                }
            });

            this.entities.remove(this.current_map_instance);
        }

        var map_instance = this.map_instances.get(id);
        if (!map_instance) {
            return;
        }

        map_instance.bodies.each((body) => {
            var entity = new Entity();
            entity.components.add(new BodyComponent({
                body: body
            }));
            this.entities.add(entity);
            body.entity = entity;
        });

        map_instance.character_instances.each((character_instance) => {
            this.characters.each((character) => {
                if (character.id === character_instance.character_id) {
                    character_instance.character = character;
                }
            });

            this.sprite_sheets.each((sprite_sheet) => {
                sprite_sheet.sprites.each((sprite) => {
                    if (sprite.id === character_instance.character.sprite_id) {
                        character_instance.character.sprite = sprite;
                    }
                });
            });

            // setup sprite instance
            var sprite_instance = new SpriteInstance({
                position: character_instance.position,
                sprite: character_instance.character.sprite,
                current_animation: character_instance.starting_animation,
                frame_time: 0.0,
                layer: map_instance.map.entity_layer_index,
                opacity: 1.0,
                tile: character_instance.character.sprite.tiles[0]
            });
            // delete position fron character instance
            delete character_instance.position;
            delete character_instance.starting_animation;

            var new_character_instance = new CharacterInstance(character_instance);
            // new_character_instance.sprite_instance = sprite_instance;
            var body = gameio.create_body(character_instance.character.body);
            character_instance.body = body;

            var entity = new Entity();
            entity.components.add(new SpriteComponent({
                sprite_instance: sprite_instance
            }));
            entity.components.add(new CharacterComponent({
                character_instance: new_character_instance
            }));

            if (body) {
                body.position[0] = sprite_instance.position[0];
                body.position[1] = sprite_instance.position[1];
                entity.components.add(new BodyComponent({
                    body: body
                }));
            }
            this.entities.add(entity);
            character_instance.entity = entity;
        });

        this.current_map_instance = new Entity();
        this.current_map_instance.components.add(new MapComponent({
            map_instance: map_instance
        }));
        this.entities.add(this.current_map_instance);

        console.log("Current Map Instance: ", this.current_map_instance);
    }
    update(time_delta) {
        this.systems.each((system) => {
            system.update(time_delta, this.entities, this.camera, this);
        });
        input.update();
    }
}

module.exports = Game;
