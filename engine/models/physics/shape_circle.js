var box2d = require('Box2dWeb');

var Model = require('../../../lib/model.js');

class ShapeCircle extends Shape {
    get defaults() {
        var defaults = super();
        defaults.type = 'circle';
        defaults.radius = 0.5;
        return defaults;
    }
    constructor(data) {
        super(data);
    }
});

module.exports = ShapeCircle;
