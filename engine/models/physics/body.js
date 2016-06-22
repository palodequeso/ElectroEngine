var Model = require('../../../lib/model.js');

class Body extends Model {
    get defaults() {
        return {
            mass: 0.0, // 0 for is_dynamic === false
            is_dynamic: false, // Does this object move from collisions?
            is_bullet: false, // Is this a fast moving dynamic object?
            entity: null, // An ECS entity
            collision_group: 'default',
            physics_engine_body: null,
            shapes: [],
            position: [0, 0]
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Body;
