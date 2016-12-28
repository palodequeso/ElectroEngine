'use strict';

var Model = require('exo').Model;

var Entity = require('../../../engine/models/ecs/entity.js');

var Inventory = require('./inventory.js');

class Player extends Model {
    get defaults() {
        return {
            health: 0,
            mana: 0,
            inventory: null,
            character_entity: null
        };
    }
    get types() {
        return {
            inventory: Inventory,
            character_entity: Entity
        };
    }
    constructor(options) {
        super(options);
    }
}

module.exports = Player;
