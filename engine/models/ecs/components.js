'use strict';

var Collection = require('exo').Collection;
var Component = require('./component.js');

class Components extends Collection {
    get model() {
        return Component;
    }
    get indexes() {
        return ['type'];
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Components;
