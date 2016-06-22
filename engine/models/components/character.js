'use strict';

var Component = require('../ecs/component.js');

class Character extends Component {
    get defaults() {
        return {
            type: 'character',
            character_instance: null
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta) {
        this.character_instance.update(time_delta);
    }
}

module.exports = Character;