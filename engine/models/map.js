'use strict';

var Model = require('../../lib/model.js');

class Map {
    get defaults() {
        return {
            name: '',
            layers: null,
            collision_layer: null,
            entity_layer: null
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Map;
