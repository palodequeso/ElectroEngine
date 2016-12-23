'use strict';

var Model = require('exo').Model;

class MapTile extends Model {
    get defaults() {
        return {
            sprite_sheet_id: null,
            total_animation_duration: 0, // If greater than 0, has animations, otherwise just display first frame.
            frames: [/* {
                css_offset_x: 0,
                css_offset_y: 0,
                duration: 100
            } */]
        };
    }
    get types() {
        return {
            //
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = MapTile;
