'use strict';

var Component = require('../ecs/component.js');
var ParticleSystemInstance = require('../particle_systems/particle_system_instance.js');

class ParticleSystem extends Component {
    get defaults() {
        return {
            type: 'particle_system',
            particle_system_instance: null
        };
    }
    get types() {
        return {
            particle_system_instance: ParticleSystemInstance
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta) {
        this.particle_system_instance.update(time_delta);
    }
}

module.exports = ParticleSystem;
