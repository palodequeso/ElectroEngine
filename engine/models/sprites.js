'use strict';

var Collection = require('../../lib/collection.js');
var Sprite = require('./sprite.js');

class Sprites extends Collection {
    get model() {
        return Sprite;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Sprites;
