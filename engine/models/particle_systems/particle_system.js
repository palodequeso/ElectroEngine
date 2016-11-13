'use strict';

var Model = require('exo').Model;

class ParticleSystem extends Model {
    get defaults() {
        return {
            name: '',
            system_position: [0, 0],
            emission_rate: 1.0,
            position_range: [[0, 0], [0, 0]],
            velocity_range: [[-10, 10], [0, 100]],
            life_range: [0, 1],
            decay_range: [0.1, 1],
            image: 'particle.png',
            fade_range: [0, 0.25],
            width_range: [32, 32],
            height_range: [32, 32],
            modifier: null,
            particle_count: 100,
            start_color_range: [[1, 1, 1], [1, 1, 1]],
            end_color_range: [[1, 1, 1], [1, 1, 1]]
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = ParticleSystem;
