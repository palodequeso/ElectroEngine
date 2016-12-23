'use strict';

var Model = require('exo').Model;
var MapTile = require('./map_tile.js');

class MapTileInstance extends Model {
    get defaults() {
        return {
            map_tile: null,
            current_frame_index: 0,
            current_time: 0.0
        };
    }
    get types() {
        return {
            map_tile: MapTile
        };
    }
    update(frame_time) {
        if (this.map_tile.total_animation_duration > 0) {
            var current_time = (this.current_time + frame_time) % this.map_tile.total_animation_duration;
            this.current_time = current_time;

            var time_index = 0;
            var found = false;
            var current_index = 0;
            for (const frame in this.map_tile.frames) {
                time_index += frame.duration;
                if (!found && current_time <= time_index) {
                    this.current_frame_index = current_index;
                    break;
                }
                current_index += 1;
            }
        }
    }
    constructor(data) {
        super(data);
    }
}

module.exports = MapTileInstance;
