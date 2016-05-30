'use strict';

var Collection = require('../../../lib/collection.js');
var CharacterInstance = require('./character_instance.js');

class CharacterInstances extends Collection {
    get model() {
        return CharacterInstance;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = CharacterInstances;
