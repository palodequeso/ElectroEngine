'use strict';

var Model = require('exo').Model;

class Sprite extends Model {
    get defaults() {
        return {
            animations: null,
            tiles: null,
            sprite_sheet: null,
            width: 0,
            height: 0,
            // If these are set, perform parallax in realtion to width/height
            render_width: null,
            render_height: null
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Sprite;
