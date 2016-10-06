'use strict';

var Collection = require('exo').Collection;
var Body = require('./body.js');

class Bodies extends Collection {
    get model() {
        return Body;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Bodies;
