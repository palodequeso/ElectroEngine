'use strict';

var Model = require('exo').Model;

class Physics extends Model {
    get defaults() {
        return {
            scale_factor: 10.0,
            collision_groups: {}
        };
    }
    constructor(data) {
        super(data);
    }
    add_collision_group_relationship(collision_group_a, collision_group_b) {
        if (!this.collision_groups.hasOwnProperty(collision_group_a)) {
            this.collision_groups[collision_group_a] = [];
        }
        if (!this.collision_groups.hasOwnProperty(collision_group_b)) {
            this.collision_groups[collision_group_b] = [];
        }
        this.collision_groups[collision_group_a].push(collision_group_b);
        this.collision_groups[collision_group_b].push(collision_group_a);
    }
    add_entity(entity) {
        // Override
    }
    update(time_delta, entities) {
        // Override
    }
}

module.exports = Physics;
