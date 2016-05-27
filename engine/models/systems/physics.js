'use strict';

var System = require('../ecs/system.js');

class Physics extends System {
    get defaults() {
        return {
            name: 'Physics',
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

module.exports = Physics;
