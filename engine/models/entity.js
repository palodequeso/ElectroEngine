'use strict';

var Model = require('../../lib/model.js');

class Entity extends Model {
    get defaults() {
        return {
            name: '',
            sprite_id: '',
            sprite: null,
            type: '',
            position_offset: [0, 0],
            dimensions: [0, 0]
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Entity;
