'use strict';

var System = require('../ecs/component.js');

class CollisionBody extends Component {
    get defaults() {
        return {
            type: 'collision_body',
            body: null
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta) {
        //
    }
}

module.exports = CollisionBody;
