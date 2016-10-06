'use strict';

var Component = require('../ecs/component.js');
var CharacterInstance = require('../characters/character_instance.js');

class Character extends Component {
    get defaults() {
        return {
            type: 'character',
            character_instance: null
        };
    }
    get types() {
        return {
            character_instance: CharacterInstance
        }
    }
    constructor(data) {
        super(data);
    }
    update(time_delta) {
        this.character_instance.update(time_delta);
    }
}

module.exports = Character;
