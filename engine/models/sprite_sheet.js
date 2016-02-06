'use strict';

var Model = require('../../lib/model.js');

class SpriteSheet extends Model {
    get defaults() {
        return {
            name: '',
            path: '',
            width: 0,
            height: 0,
            tile_width: 32,
            tile_height: 32,
            sprites: null
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = SpriteSheet;
