'use strict';

class EntityInstance {
    constructor() {
        this.id = null;
        this.name = '';
        this.entity_id = null;
        this.entity = null;
        this.sprite_instance = null;
        this.velocity = [0, 0];
        this.previous_velocity = [0, 0];
    }
}

module.exports = EntityInstance;
