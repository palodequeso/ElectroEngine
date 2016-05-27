'use strict';

var Collection = require('../../../lib/collection.js');
var Component = require('./component.js');

class Components extends Collection {
    get model() {
        return Component;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Components;
