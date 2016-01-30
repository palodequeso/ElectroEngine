'use strict';

var Collection = require('../../lib/collection.js');
var ParticleSystem = require('./particle_system.js');

class ParticleSystems extends Collection {
    get model() {
        return ParticleSystem;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = ParticleSystems;
