var box2d = require('Box2dWeb');

var Model = require('../../../lib/model.js');

class Body extends Model {
    get defaults() {
        return {
            mass: 0.0, // 0 for is_dynamic === false
            is_dynamic: false, // Does this object move from collisions?
            is_bullet: false, // Is this a fast moving dynamic object?
            entity: null, // An ECS entity
            collision_groups: [],
            physics_engine_body: null,
            shapes: []
        };
    }
    constructor(data) {
        super(data);
    }
});

module.exports = Body;
