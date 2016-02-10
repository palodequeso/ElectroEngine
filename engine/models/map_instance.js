'use strict';

var Model = require('../../lib/model.js');
var Map = require('./map.js');
var EntityInstances = require('./entity_instances.js');
var MapLayerInstances = require('./map_layer_instances.js');

class MapInstance extends Model {
    get defaults() {
        return {
            name: '',
            map: null,
            position: [0, 0],
            warps: {},
            entity_instances: null,
            layer_instances: null
        };
    }
    constructor(data) {
        super(data);

        if (this.map === null) {
            this.map = {};
        }
        if (this.entity_instances === null) {
            this.entity_instances = [];
        }
        if (this.layer_instances === null) {
            this.layer_instances = [];
        }

        this.map = new Map(this.map);
        this.entity_instances = new EntityInstances(this.entity_instances);
        this.layer_instances = new MapLayerInstances(this.layer_instances);

    }
    update(time_delta) {
        this.map.layers.forEach((layer) => {
            layer.sprite_instances.forEach((sprite_instance) => {
                sprite_instance.update(time_delta);
            });
        });
    }
}

module.exports = MapInstance;
