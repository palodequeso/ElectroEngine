'use strict';

var Model = require('../../lib/model.js');

// NOTE: I think this might need an instance version as well since it has sprite_instances, and can be used in many
//   different map instances.
class MapLayerInstance {
    get defaults() {
        return {
            map_layer: null,
            sprite_instances: null
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = MapLayerInstance;
