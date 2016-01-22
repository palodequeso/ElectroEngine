'use strict';

// NOTE: I think this might need an instance version as well since it has sprite_instances, and can be used in many
//   different map instances.
class MapLayerInstance {
    constructor() {
        this.id = null;
        this.map_layer = null;
        this.sprite_instances = null;
    }
}

module.exports = MapLayerInstance;
