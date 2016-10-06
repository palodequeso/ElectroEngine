'use strict';

var Shape = require('./shape.js');

class ShapeCircle extends Shape {
    get defaults() {
        var defaults = super.defaults;
        defaults.type = 'circle';
        defaults.radius = 0.5;
        return defaults;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = ShapeCircle;
