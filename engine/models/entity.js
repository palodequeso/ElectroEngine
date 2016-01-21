'use strict';

class Entity {
    constructor() {
        this.name = '';
        this.sprite_id = '';
        this.sprite = null;
        this.type = '';
        this.position_offset = [0, 0];
        this.dimensions = [0, 0];
    }
}

module.exports = Entity;
