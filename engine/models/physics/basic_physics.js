var Physics = require('./physics.js');

// TODO: for both top down and platformer eventually I guess
class BasicPhysics extends Physics {
    get defaults() {
        var defaults = super.defaults;
        return defaults;
    }
    constructor(data) {
        super(data);
    }
    update(time_delta, entities) {
        //
    }
}

module.exports = BasicPhysics;
