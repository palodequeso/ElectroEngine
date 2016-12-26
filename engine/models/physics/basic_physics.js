'use strict';

var Physics = require('./physics.js');

class BasicPhysics extends Physics {
    get defaults() {
        var defaults = super.defaults;
        return defaults;
    }
    constructor(data) {
        super(data);
    }
    update(time_delta, entities) {
        var components;
        var map_instance = null;
        var character_instances = [];
        entities.each(entity => {
            components = entity.components.get_by_index('type', 'map');
            if (components) {
                components.forEach(component => {
                    map_instance = component.map_instance;
                });
            }
            components = entity.components.get_by_index('type', 'character');
            if (components) {
                components.forEach(component => {
                    if (component.character_instance.velocity[0] !== 0 ||
                        component.character_instance.velocity[1] !== 0) {
                        character_instances.push(component.character_instance);
                    }
                });
            }
        });

        var collision_layer = map_instance.map.collision_layer;
        if (collision_layer.tiles_x <= 0 && collision_layer.tiles_y <= 0) {
            // No viable collision layer!
            return;
        }

        character_instances.forEach(character_instance => {
            var position = character_instance.sprite_instance.position;
            var velocity = character_instance.velocity;
            var dimensions = [8, 8];
            var result = collision_layer.check_collision(position, velocity, dimensions);

            if (result[0] !== 0 || result[1] !== 0) {
                velocity[0] += result[0];
                velocity[1] += result[1];
                character_instance.set_velocity_and_animation(velocity);
            }
        });
    }
}

module.exports = BasicPhysics;
