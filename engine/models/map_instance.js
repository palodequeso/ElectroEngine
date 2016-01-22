'use strict';

class MapInstance {
    constructor() {
        this.id = null;
        this.name = '';
        this.map_id = null;
        this.map = null;
        this.position = [0, 0];
        this.warps = {};
        this.entity_instances = null;
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
