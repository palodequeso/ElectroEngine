'use strict';

class SpriteInstance {
    constructor() {
        this.position = [0, 0];
        this.sprite_id = null;
        this.current_animation = '';
        this.frame_time = 0.0;
        this.layer = null;
        this.opacity = 0.0;
        this.sprite = null;
        this.tile = null;
    }
}

module.exports = SpriteInstance;
