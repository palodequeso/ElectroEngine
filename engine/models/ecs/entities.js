'use strict';

var Collection = require('../../../lib/collection.js');
var Entity = require('./entity.js');

class Entities extends Collection {
    get model() {
        return Entity;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Entities;
