'use strict';

var Collection = require('exo').Collection;
var MapLayerInstance = require('./map_layer_instance.js');

class MapLayerInstances extends Collection {
    get model() {
        return MapLayerInstance;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = MapLayerInstances;
