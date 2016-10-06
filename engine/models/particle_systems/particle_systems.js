'use strict';

var Collection = require('exo').Collection;
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
