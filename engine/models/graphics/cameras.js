'use strict';

var Collection = require('../../../lib/collection.js');
var Camera = require('./camera.js');

class Cameras extends Collection {
    get model() {
        return Camera;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Cameras;
