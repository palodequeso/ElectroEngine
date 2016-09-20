'use strict';

var Model = require('../../../lib/model.js');

class Particle extends Model {
    get defaults() {
        return {
            position: [0, 0],
            velocity: [0, 0],
            start_color: [0, 0, 0],
            end_color: [0, 0, 0],
            color: [0, 0, 0],
            size: 0.0,
            fade: 0.0,
            start_life: 0.0,
            life: 0.0,
            decay: 0.0
        };
    }
    constructor(data) {
        super(data);
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
        var start_life = this.start_life;
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
