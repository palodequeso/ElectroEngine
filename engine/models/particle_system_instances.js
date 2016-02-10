'use strict';

var Collection = require('../../lib/collection.js');
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
