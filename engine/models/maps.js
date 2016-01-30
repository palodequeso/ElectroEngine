'use strict';

var Collection = require('../../lib/collection.js');
var Map = require('./map.js');

class Maps extends Collection {
    get model() {
        return Map;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Maps;
