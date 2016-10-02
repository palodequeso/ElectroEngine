'use strict';

var Component = require('../ecs/component.js');

class MapInstance extends Component {
    get defaults() {
        return {
            type: 'map_instance',
            map_instance: null
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta) {
        //
    }
}

module.exports = MapInstance;
