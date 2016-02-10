'use strict';

var Model = require('../../lib/model.js');

class Sprite extends Model {
    get defaults() {
        return {
            image: null,
            animations: null,
            tiles: null,
            width: 0,
            height: 0
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Sprite;
