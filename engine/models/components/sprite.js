'use strict';

var Component = require('../ecs/component.js');

class Sprite extends Component {
    get defaults() {
        return {
            type: 'sprite',
            sprite_instance: null
        };
    }
    constructor(data) {
        super(data);
    }
    update(time_delta) {
        this.sprite_instance.update(time_delta);
    }
}

module.exports = Sprite;
