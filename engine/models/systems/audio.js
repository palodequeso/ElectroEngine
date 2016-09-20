'use strict';

var System = require('../ecs/system.js');

class Audio extends System {
    get defaults() {
        return {
            name: 'Audio',
            order_index: 0
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta, entities) {
        //
    }
}

module.exports = Audio;
