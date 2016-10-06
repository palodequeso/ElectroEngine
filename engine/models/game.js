'use strict';

var Model = require('exo').Model;

var input = require('./input.js');
var Maps = require('./maps/maps.js');
var Characters = require('./characters/characters.js');
var Sprites = require('./graphics/sprites.js');
var SpriteSheets = require('./graphics/sprite_sheets.js');
var ParticleSystems = require('./particle_systems/particle_systems.js');
var Entities = require('./ecs/entities.js');
var Systems = require('./ecs/systems.js');
var Camera = require('./graphics/camera.js');
var MapInstances = require('./maps/map_instances.js');

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
            map_instances: MapInstances
        };
    }
    constructor(data) {
        super(data);

        this.systems.sort();
    }
    set_current_map_instance(id) {
        this.map_instances
    }
    update(time_delta) {
        this.systems.each((system) => {
            system.update(time_delta, this.entities, this.camera);
        });
        input.update();
    }
}

module.exports = Game;
