'use strict';

var System = require('../ecs/component.js');

class ParticleSystem extends Component {
    get defaults() {
        return {
            type: 'particle_system',
            particle_system_instance: null
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
