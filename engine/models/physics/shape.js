'use strict';

var Model = require('exo').Model;

class Shape extends Model {
    get defaults() {
        return {
            offset: [0, 0],
            angle: 0,
            type: 'none'
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Shape;
