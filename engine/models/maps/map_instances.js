'use strict';

var Collection = require('exo').Collection;
var MapInstance = require('./map_instance.js');

class MapInstances extends Collection {
    get model() {
        return MapInstance;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = MapInstances;
