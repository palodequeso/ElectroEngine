'use strict';

var Model = require('exo').Model;
var Bodies = require('../physics/bodies.js');
var CharacterInstances = require('../characters/character_instances.js');
var MapTileInstances = require('./map_tile_instances.js');

class MapInstance extends Model {
    get defaults() {
        return {
            name: '',
            activated: false, // when this is false, the instances have not been created from the base map yet.
            map: null,
            position: [0, 0],
            warps: [],
            bodies: null, // For reference only!
            character_instances: null,
            map_tile_instances: null // Only one per unique map_tile is needed, just gets rendered multiple times.
        };
    }
    get types() {
        return {
            character_instances: CharacterInstances,
            map_tile_instances: MapTileInstances,
            bodies: Bodies
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta) {
        this.map_tile_instances.each(map_tile_instance => {
            map_tile_instance.update(time_delta);
        });
    }
}

module.exports = MapInstance;
