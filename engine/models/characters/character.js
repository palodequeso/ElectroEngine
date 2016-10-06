'use strict';

var Model = require('exo').Model;
var Sprite = require('../graphics/sprite.js');

class Character extends Model {
    get defaults() {
        return {
            name: '',
            sprite: null,
            type: '',
            position_offset: [0, 0],
            dimensions: [0, 0]
        };
    }
    get types() {
        return {
            sprite: Sprite
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Character;
