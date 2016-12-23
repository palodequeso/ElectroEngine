'use strict';

var Model = require('exo').Model;
var Sprites = require('./sprites.js');

// NOTE: http://gamedev.stackexchange.com/questions/20/where-can-i-find-free-sprites-and-images
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
    get types() {
        return {
            sprites: Sprites
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = SpriteSheet;
