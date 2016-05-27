var box2d = require('Box2dWeb');

var Model = require('../../../lib/model.js');

class Shape extends Model {
    get defaults() {
        return {
            friction: 0.0, // 0.5
            restitution: 0.0, // 0.2
            density: 0.0, // 1.0
            type: 'none'
        };
    }
    constructor(data) {
        super(data);
    }
});

module.exports = Shape;
