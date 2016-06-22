'use strict';

var Model = require('../../../lib/model.js');
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
    constructor(data) {
        super(data);

        if (this.sprite === null) {
            this.sprite = {};
        }
        this.sprite = new Sprite(this.sprite);
    }
}

module.exports = Character;