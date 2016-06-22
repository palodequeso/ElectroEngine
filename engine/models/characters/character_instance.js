'use strict';

var Model = require('../../../lib/model.js');

class CharacterInstance extends Model {
    get defaults() {
        return {
            name: '',
            character: null,
            sprite_instance: null, // TODO: This is no longer needed because of the ECS
            velocity: [0, 0],
            previous_velocity: [0, 0]
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta) {
        var position = this.sprite_instance.position;
        var velocity = this.velocity;
        position[0] += velocity[0];
        position[1] += velocity[1];
        this.sprite_instance.position = position;
    }
    set_velocity_and_animation(velocity, animation) {
        var previous_velocity = this.previous_velocity;
        if (velocity[0] != previous_velocity[0] || velocity[1] != previous_velocity[1]) {
            previous_velocity[0] = velocity[0];
            previous_velocity[1] = velocity[1];
        }
        this.velocity = velocity;
        this.previous_velocity = previous_velocity;
        this.sprite_instance.current_animation = animation;
    }
}

module.exports = CharacterInstance;