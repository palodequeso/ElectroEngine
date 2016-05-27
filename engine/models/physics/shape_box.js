var box2d = require('Box2dWeb');

var Model = require('../../../lib/model.js');

class ShapeBox extends Shape {
    get defaults() {
        var defaults = super();
        defaults.type = 'box';
        defaults.top_left = [0.0, 0.0];
        defaults.bottom_right = [1.0, 1.0];
        return defaults;
    }
    constructor(data) {
        super(data);
    }
});

module.exports = ShapeBox;
