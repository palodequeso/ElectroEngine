'use strict';

var Model = require('exo').Model;

var input = require('./input.js');
var Maps = require('./maps/maps.js');
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
var MapLayerInstance = require('./maps/map_layer_instance.js');
var SpriteComponent = require('./components/sprite.js');

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
            current_map_instance: MapInstance
        };
    }
    constructor(data) {
        super(data);

        this.systems.sort();
    }
    set_current_map_instance(id, force) {
        if (force === undefined) {
            force = false;
        }

        if (force || (this.current_map_instance && id === this.current_map_instance.id)) {
            return;
        }

        // NOTE: This only allows one map to be viewed at a time, so we'll have to work on that.
        if (this.current_map_instance) {
            this.current_map_instance.layer_instances.each(layer_instance => {
                layer_instance.entities.each(entity => {
                    this.entities.remove(entity);
                });
                layer_instance.entities.reset();
            });
        }

        this.current_map_instance = this.map_instances.get(id);

        if (!this.current_map_instance) {
            return;
        }

        // Load the map layers
        var map = this.current_map_instance.map;
        this.current_map_instance.layer_instances.reset();// = new MapLayerInstances();
        this.current_map_instance.map.layers.each((map_layer, layer_index) => {
            var map_layer_instance = new MapLayerInstance({
                map_layer: map_layer
            });

            var layer_width = map_layer.width;
            var layer_height = map_layer.height;
            map_layer.tiles.forEach((tile_id, tile_index) => {
                if (tile_id === -1) {
                    return;
                }

                var x = (tile_index % layer_width) * map.tile_width;
                var y = (map.tile_height * layer_height) - ((Math.floor(tile_index / layer_width)) * map.tile_height)
                    - map.tile_height;

                map_layer_instance.map_layer.sprite_sheet = this.sprite_sheets.get(
                    map_layer_instance.map_layer.sprite_sheet_id);
                var sprite = this.sprites.get(tile_id);
                var opacity = 1.0;

                var sprite_instance = new SpriteInstance({
                    position: [x, y],
                    current_animation: '',
                    frame_time: 0.0,
                    layer: layer_index,
                    opacity: opacity,
                    sprite: sprite,
                    tile: (!sprite) ? null : sprite.tiles[0]
                });

                var entity = new Entity();
                entity.components.add(new SpriteComponent({
                    sprite_instance: sprite_instance
                }));

                this.entities.add(entity);
                map_layer_instance.entities.add(entity);
            });

            // TODO: Load Map Instance Sprites into entities, store as references on map_layer_instances?
            this.current_map_instance.layer_instances.add(map_layer_instance);
        });

        this.current_map_instance.bodies.each((body) => {
            // TODO: Add to physics system.
        });

        this.current_map_instance.character_instances.forEach((character_instance) => {
            // TODO: Load into it's own entities, and store reference on character_instance object.
        });

        // TODO: Map instance particle systems, when the time comes.

        // var entity = new Entity();
        // entity.add_component(new MapInstanceComponent({
        //     map_instance: this.current_map_instance
        // }));
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
