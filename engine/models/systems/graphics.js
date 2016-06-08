'use strict';

var System = require('../ecs/system.js');

class Graphics extends System {
    get defaults() {
        return {
            name: 'Graphics',
            order_index: 0
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta, entities) {
        entities.each((entity, index) => {
            var components = entity.components.get_by_index('type', 'sprite');
            if (components) {
                components.forEach((component) => {
                    component.update(time_delta);
                });
            }

            var components = entity.components.get_by_index('type', 'particle_system');
            if (components) {
                components.forEach((component) => {
                    component.update(time_delta);
                });
            }
        });
    }
}

module.exports = Graphics;
