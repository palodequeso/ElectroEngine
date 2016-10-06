'use strict';

var Collection = require('exo').Collection;
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
