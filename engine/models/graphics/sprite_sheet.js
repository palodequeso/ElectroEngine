'use strict';

var Model = require('../../../lib/model.js');
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
    constructor(data) {
        super(data);

        if (this.sprites === null) {
            this.sprites = [];
        }

        this.sprites.forEach((sprite) => {
            sprite.sprite_path = this.path;
            sprite.sprite_sheet_id = this.sprite_sheet_id;
        });

        this.sprites = new Sprites(this.sprites);
    }
}

module.exports = SpriteSheet;
