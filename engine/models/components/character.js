'use strict';

var System = require('../ecs/component.js');

class Character extends Component {
    get defaults() {
        return {
            type: 'character',
            entity_instance: null
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta) {
        //
    }
}

module.exports = Audio;
