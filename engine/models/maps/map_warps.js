'use strict';

var Collection = require('exo').Collection;
var MapWarp = require('./map_warp.js');

class MapWarps extends Collection {
    get model() {
        return MapWarp;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = MapWarps;
