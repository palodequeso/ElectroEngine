'use strict';

var Model = require('../../lib/model.js');

class Map extends Model {
    get defaults() {
        return {
            name: '',
            layers: null,
            collision_layer: null,
            entity_layer: null,
            sprite_sheets: null
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Map;
