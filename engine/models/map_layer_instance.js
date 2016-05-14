'use strict';

var Model = require('../../lib/model.js');
var SpriteInstances = require('./sprite_instances.js');

// NOTE: I think this might need an instance version as well since it has sprite_instances, and can be used in many
//   different map instances.
class MapLayerInstance extends Model {
    get defaults() {
        return {
            map_layer: null,
            sprite_instances: null
        };
    }
    constructor(data) {
        super(data);

        if (this.sprite_instances === null) {
            this.sprite_instances = [];
        }

        this.sprite_instances = new SpriteInstances(this.layers);
    }
}

module.exports = MapLayerInstance;
