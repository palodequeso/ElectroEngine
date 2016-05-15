'use strict';

var Model = require('../../lib/model.js');
var ParticleSystem = require("./particle_system.js");
var Particle = require('./particle.js');
var util = require('../util/util.js');

class ParticleSystemInstance extends Model {
    get defaults() {
        return {
            name: '',
            position: [0, 0],
            particles: [],
            particle_system: null
        };
    }
    constructor(data) {
        super(data);

        if (this.particle_system === null) {
            this.particle_system = {};
        }
        this.particle_system = new ParticleSystem(this.particle_system);
    }
    update(time_delta) {
        var to_remove = [];
        this.particles.forEach((particle, particle_index) => {
            particle.update(time_delta);
            if (particle.life < 0.0) {
                to_remove.push(particle_index);
            }
        });

        to_remove.reverse();
        to_remove.forEach((particle_index) => {
            // TODO: This won't work since this is no longer a backbone collection.
            this.particles.splice(particle_index, 1);
        });

        var particle_system = this.particle_system;

        for (var i = 0; i < particle_system.particle_count - this.particles.length; i++) {
            var life = util.rand_range(particle_system.life_range[0], particle_system.life_range[1]);
            var start_color = [
                util.rand_range(particle_system.start_color_range[0][0],
                                particle_system.start_color_range[1][0]),
                util.rand_range(particle_system.start_color_range[0][1],
                                particle_system.start_color_range[1][1]),
                util.rand_range(particle_system.start_color_range[0][2],
                                particle_system.start_color_range[1][2])
            ];
            var particle = new Particle();
            particle.position = [
                util.rand_range(particle_system.position_range[0][0],
                                particle_system.position_range[0][1]),
                util.rand_range(particle_system.position_range[1][0],
                                particle_system.position_range[1][1])
            ];
            particle.velocity = [
                util.rand_range(particle_system.velocity_range[0][0],
                                particle_system.velocity_range[0][1]),
                util.rand_range(particle_system.velocity_range[1][0],
                                particle_system.velocity_range[1][1])
            ];
            particle.start_color = start_color;
            particle.end_color = [
                util.rand_range(particle_system.end_color_range[0][0],
                                particle_system.end_color_range[1][0]),
                util.rand_range(particle_system.end_color_range[0][1],
                                particle_system.end_color_range[1][1]),
                util.rand_range(particle_system.end_color_range[0][2],
                                particle_system.end_color_range[1][2])
            ];
            particle.color = start_color;
            particle.fade = util.rand_range(particle_system.fade_range[0], particle_system.fade_range[1]);
            particle.start_life = life;
            particle.life = life;
            particle.decay = util.rand_range(particle_system.decay_range[0], particle_system.decay_range[1]);
            particle.size = [util.rand_range(particle_system.width_range[0], particle_system.width_range[1]),
                             util.rand_range(particle_system.height_range[0], particle_system.height_range[1])];
            this.particles.push(particle);
        }
    }
}

module.exports = ParticleSystemInstance;
