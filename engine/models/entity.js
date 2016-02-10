'use strict';

var Model = require('../../lib/model.js');
var Sprite = require('./sprite.js');

class Entity extends Model {
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

module.exports = Entity;
