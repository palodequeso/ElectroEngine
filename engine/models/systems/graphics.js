'use strict';

var System = require('../ecs/system.js');

class Graphics extends System {
    get defaults() {
        return {
            name: 'Graphics',
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

module.exports = Graphics;
