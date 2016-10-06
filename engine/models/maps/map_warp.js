'use strict';

var Model = require('exo').Model;

class MapWarp extends Model {
    get defaults() {
        return {
            name: '',
            position: [0, 0],
            size: [32, 32],
            target_map_instance_id: null,
            target_map_position: [0, 0]
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta) {
        //
    }
}

module.exports = MapWarp;
