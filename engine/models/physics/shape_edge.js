var Shape = require('./shape.js');

class ShapeEdge extends Shape {
    get defaults() {
        var defaults = super.defaults;
        defaults.type = 'edge';
        defaults.begin = [0.0, 0.0];
        defaults.end = [1.0, 0.0];
        return defaults;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = ShapeEdge;
