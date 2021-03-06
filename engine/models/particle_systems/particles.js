'use strict';

var Collection = require('exo').Collection;
var Particle = require('./particle.js');

class Particles extends Collection {
    get model() {
        return Particle;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Particles;
