'use strict';

var Model = require('../../lib/model.js');
var Sprites = require('./sprites.js');

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

        if (this.sprites === null) {
            this.sprites = [];
        }

        console.log("Sprites: ", this.sprites);
        this.sprites = new Sprites(this.sprites);
        console.log("After Sprites: ", this.sprites);
    }
}

module.exports = SpriteSheet;
