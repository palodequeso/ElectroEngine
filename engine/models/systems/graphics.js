'use strict';

var System = require('../ecs/system.js');

class Graphics extends System {
    get defaults() {
        return {
            name: 'Graphics',
            order_index: 0,
            renderer: null
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta, entities) {
        entities.forEach((entity) => {
            var components = entity.components.get_by_index('type', 'Sprite');
            components.forEach((component) => {
                component.sprite_instance.update(time_delta);
            });
        });
    }
}

module.exports = Graphics;
