'use strict';

var Collection = require('../../../lib/collection.js');
var Character = require('./character.js');

class Characters extends Collection {
    get model() {
        return Character;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Characters;
