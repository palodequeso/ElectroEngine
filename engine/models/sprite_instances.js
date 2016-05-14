'use strict';

var Collection = require('../../lib/collection.js');
var SpriteInstance = require('./sprite_instance.js');

class SpriteInstances extends Collection {
    get model() {
        return SpriteInstance;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = SpriteInstances;
