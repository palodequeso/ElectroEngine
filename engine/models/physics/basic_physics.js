'use strict';

var Physics = require('./physics.js');

class BasicPhysics extends Physics {
    get defaults() {
        var defaults = super.defaults;
        return defaults;
    }
    constructor(data) {
        super(data);
    }
    update(time_delta, entities) {
        //
    }
}

module.exports = BasicPhysics;
