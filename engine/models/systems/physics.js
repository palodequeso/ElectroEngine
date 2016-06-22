'use strict';

var System = require('../ecs/system.js');

class Physics extends System {
    get defaults() {
        return {
            name: 'Physics',
            order_index: 0,
            engine: null
        };
    }
    constructor(data) {
        super(data);
        this.entities_added = false;
        // Instantiate default engine if none was passed in.
    }
    update(time_delta, entities) {
        if (!this.entities_added) {
            console.log("Entities: ", entities);
            this.engine.add_collision_group_relationship('characters', 'maps');
            entities.each((entity) => {
                this.engine.add_entity(entity);
            });
            this.entities_added = true;
        }
        if (this.engine) {
            this.engine.update(time_delta, entities);
        }
        // update graphics position
    }
}

module.exports = Physics;
