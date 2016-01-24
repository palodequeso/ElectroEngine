'use strict';

var Model = require('../../lib/model.js');

// NOTE: I think this might need an instance version as well since it has sprite_instances, and can be used in many
//   different map instances.
class MapLayer {
    get defaults() {
        return {
            name: '',
            sprite_instances: null,
            width: 0,
            height: 0
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = MapLayer;
