'use strict';

class Particle {
    constructor() {
        this.position = [0, 0];
        this.velocity = [0, 0];
        this.start_color = [0, 0, 0];
        this.end_color = [0, 0, 0];
        this.color = [0, 0, 0];
        this.size = 0.0;
        this.fade = 0.0;
        this.start_life = 0.0;
        this.life = 0.0;
        this.decay = 0.0;
    }
}

module.exports = Particle;
