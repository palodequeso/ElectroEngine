'use strict';

var Collection = require('exo').Collection;
var MapTile = require('./map_tile.js');

class MapTiles extends Collection {
    get model() {
        return MapTile;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = MapTiles;
