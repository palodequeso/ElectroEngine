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
}

module.exports = MapInstance;
