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
    update(time_delta) {
        var position = this.position;
        var velocity = this.velocity;
        var time_delta_seconds = time_delta / 1000.0;
        position[0] += velocity[0] * time_delta_seconds;
        position[1] += velocity[1] * time_delta_seconds;
        var life = this.life - (this.decay * time_delta_seconds);
        var start_color = this.start_color;
        var end_color = this.end_color;
        var start_life = this.tart_life;
        var perc = life / start_life;
        var color = [
            (perc * start_color[0]) + ((1.0 - perc) * end_color[0]),
            (perc * start_color[1]) + ((1.0 - perc) * end_color[1]),
            (perc * start_color[2]) + ((1.0 - perc) * end_color[2])
        ];
        this.life = life;
        this.position = position;
        this.color = color;
    }
}

module.exports = Particle;
