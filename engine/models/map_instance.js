'use strict';

var Model = require('../../lib/model.js');

class MapInstance {
    get defaults() {
        return {
            name: ''.
            map_id: null,
            map: null,
            position: [0, 0],
            warps: {},
            entity_instances: null
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta) {
        this.map.layers.forEach((layer) => {
            layer.sprite_instances.forEach((sprite_instance) => {
                sprite_instance.update(time_delta);
            });
        });
    }
}

module.exports = MapInstance;
