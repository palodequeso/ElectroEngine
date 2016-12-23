'use strict';

var Collection = require('exo').Collection;
var MapTileInstance = require('./map_tile_instance.js');

class MapTileInstances extends Collection {
    get model() {
        return MapTileInstance;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = MapTileInstances;
