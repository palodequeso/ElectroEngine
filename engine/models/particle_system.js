'use strict';

class ParticleSystem {
    constructor() {
        this.id = null;
        this.name = '';
        this.system_position = [0, 0];
        this.emission_rate = 0.0;
        this.position_range = [[0, 0], [0, 0]];
        this.velocity_range = [[0, 0], [0, 0]];
        this.life_range = [0, 0];
        this.decay_range = [0, 0];
        this.image = null;
        this.fade_range = [0, 0];
        this.width_range = [0, 0];
        this.height_range = [0, 0];
        this.modifier = null;
        this.particle_count = 0;
        this.start_color_range = [[0, 0, 0], [0, 0, 0]];
        this.end_color_range = [[0, 0, 0], [0, 0, 0]];
    }
}

module.exports = ParticleSystem;
