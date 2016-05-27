'use strict';

var Model = require('../../../lib/model.js');

class Sprite extends Model {
    get defaults() {
        return {
            animations: null,
            tiles: null,
            sprite_sheet: null,
            width: 0,
            height: 0
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Sprite;
