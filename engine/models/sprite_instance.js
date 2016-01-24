'use strict';

var Model = require('../../lib/model.js');

class SpriteInstance {
    get defaults() {
        return {
            position: [0, 0],
            sprite_id: null,
            current_animation: '',
            frame_time: 0.0,
            layer: null,
            opacity: 0.0,
            sprite: null,
            tile: null
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta) {
        var animations = this.sprite.animations;
        if (animations === null) {
            var animation = animations[this.current_animation];

            var frame_time = (this.frame_time + time_delta) % animation.time;
            this.frame_time = frame_time;

            var time_index = 0;
            var found = false;
            animation.frames.forEach((frame) => {
                time_index += frame.duration;
                if (!found && frame_time <= time_index) {
                    var tile = this.sprite.tiles[frame.index];
                    this.tile = tile;
                    found = true;
                }
            });
        }
    }
}

module.exports = SpriteInstance;
