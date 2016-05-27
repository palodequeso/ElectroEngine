'use strict';

var Collection = require('../../../lib/collection.js');
var System = require('./system.js');

class Systems extends Collection {
    get model() {
        return System;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Systems;
