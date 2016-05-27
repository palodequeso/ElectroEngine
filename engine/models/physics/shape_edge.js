var box2d = require('Box2dWeb');

var Model = require('../../../lib/model.js');

class ShapeEdge extends Shape {
    get defaults() {
        var defaults = super();
        defaults.type = 'edge';
        defaults.begin = [0.0, 0.0];
        defaults.end = [1.0, 0.0];
        return defaults;
    }
    constructor(data) {
        super(data);
    }
});

module.exports = ShapeEdge;
