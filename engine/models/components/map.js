'use strict';

var Component = require('../ecs/component.js');
var MapInstance = require('../maps/map_instance.js');

class CollisionBody extends Component {
    get defaults() {
        return {
            type: 'map',
            map_instance: null
        };
    }
    get types() {
        return {
            map_instance: MapInstance
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta) {
        this.map_instance.update(time_delta);
    }
}

module.exports = CollisionBody;
