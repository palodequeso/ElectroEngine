'use strict';

var System = require('../ecs/system.js');

class Map extends System {
    get defaults() {
        return {
            name: 'Map',
            order_index: 0
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta, entities) {
        entities.each(entity => {
            var components = entity.components.get_by_index('type', 'map');
            if (components) {
                components.forEach(component => {
                    component.update(time_delta);
                });
            }
        });
    }
}

module.exports = Map;
