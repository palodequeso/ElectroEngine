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
    update(time_delta) {
        var animations = this.sprite.animations;
        if (!_.isNull(animations)) {
            var animation = animations[this.current_animation];

            var frame_time = (this.frame_time + time_delta) % animation.time;
            this.frame_time = frame_time;

            var time_index = 0;
            var found = false;
            _.each(animation.frames, (frame, frame_index) => {
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
