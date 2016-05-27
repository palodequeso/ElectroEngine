'use strict';

var Model = require('../../../lib/model.js');
var EntityInstances = require('../characters/entity_instances.js');
var Map = require('./map.js');
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
        this.layer_instances.each((layer_instance) => {
            layer_instance.sprite_instances.each((sprite_instance) => {
                sprite_instance.update(time_delta);
            });
        });
        this.entity_instances.each((entity_instance) => {
            entity_instance.update(time_delta);
        });
    }
}

module.exports = MapInstance;
