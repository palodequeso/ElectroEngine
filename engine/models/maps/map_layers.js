'use strict';

var Collection = require('../../../lib/collection.js');
var MapLayer = require('./map_layer.js');

class MapLayers extends Collection {
    get model() {
        return MapLayer;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = MapLayers;
