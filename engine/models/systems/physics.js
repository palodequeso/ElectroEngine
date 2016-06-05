'use strict';

var System = require('../ecs/system.js');

class Physics extends System {
    get defaults() {
        return {
            name: 'Physics',
            order_index: 0,
            engine: null
        };
    }
    constructor(data) {
        super(data);

        // Instantiate default engine if none was passed in.
    }
    update(time_delta, entities) {
        //
    }
}

module.exports = Physics;
