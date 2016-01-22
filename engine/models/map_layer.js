'use strict';

// NOTE: I think this might need an instance version as well since it has sprite_instances, and can be used in many
//   different map instances.
class MapLayer {
    constructor() {
        this.id = null;
        this.name = '';
        this.sprite_instances = null;
        this.width = 0;
        this.height = 0;
    }
}

module.exports = MapLayer;
