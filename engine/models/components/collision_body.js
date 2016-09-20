'use strict';

var Component = require('../ecs/component.js');

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
        // test
    }
}

module.exports = CollisionBody;
