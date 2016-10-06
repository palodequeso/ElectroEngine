'use strict';

var Model = require('exo').Model;
var CharacterInstances = require('../characters/character_instances.js');
var Map = require('./map.js');
var MapLayerInstances = require('./map_layer_instances.js');

class MapInstance extends Model {
    get defaults() {
        return {
            name: '',
            activated: false, // when this is false, the instances have not been created from the base map yet.
            map: null,
            position: [0, 0],
            warps: [],
            bodies: [],
            character_instances: null,
            layer_instances: null
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta) {
        this.layer_instances.each((layer_instance) => {
            layer_instance.sprite_instances.each((sprite_instance) => {
                sprite_instance.update(time_delta);
            });
        });
        this.character_instances.each((character_instances) => {
            character_instances.update(time_delta);
        });
    }
}

module.exports = MapInstance;
