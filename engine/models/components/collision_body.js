'use strict';

var Component = require('../ecs/component.js');
var Body = require('../physics/body.js');

class CollisionBody extends Component {
    get defaults() {
        return {
            type: 'collision_body',
            body: null
        };
    }
    get types() {
        return {
            body: Body
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
