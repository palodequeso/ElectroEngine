var box2d = require('Box2dWeb');

var Shape = require('./shape.js');

class ShapePolygon extends Shape {
    get defaults() {
        var defaults = super();
        defaults.type = 'polygon';
        defaults.vertices = []; // array of two dimensional arrays.
        return defaults;
    }
    constructor(data) {
        super(data);
    }
});

module.exports = ShapePolygon;
