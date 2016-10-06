'use strict';

var Model = require('exo').Model;

class System extends Model {
    get defaults() {
        return {
            name: '',
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
