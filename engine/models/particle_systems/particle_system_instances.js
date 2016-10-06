'use strict';

var Collection = require('exo').Collection;
var ParticleSystemInstance = require('./particle_system_instance.js');

class ParticleSystemInstances extends Collection {
    get model() {
        return ParticleSystemInstance;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = ParticleSystemInstances;
