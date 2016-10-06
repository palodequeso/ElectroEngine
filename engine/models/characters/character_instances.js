'use strict';

var Collection = require('exo').Collection;
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
