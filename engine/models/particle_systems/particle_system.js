'use strict';

var Model = require('exo').Model;

class ParticleSystem extends Model {
    get defaults() {
        return {
            name: '',
            system_position: [0, 0],
            emission_rate: 0.0,
            position_range: [[0, 0], [0, 0]],
            velocity_range: [[0, 0], [0, 0]],
            life_range: [0, 0],
            decay_range: [0, 0],
            image: null,
            fade_range: [0, 0],
            width_range: [0, 0],
            height_range: [0, 0],
            modifier: null,
            particle_count: 0,
            start_color_range: [[0, 0, 0], [0, 0, 0]],
            end_color_range: [[0, 0, 0], [0, 0, 0]]
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = ParticleSystem;
