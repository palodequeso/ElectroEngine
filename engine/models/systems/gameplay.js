'use strict';

var System = require('../ecs/system.js');

class Gameplay extends System {
    get defaults() {
        return {
            name: 'Gameplay',
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

module.exports = System;
