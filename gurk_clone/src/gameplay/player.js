'use strict';

var Model = require('exo').Model;

var Entity = require('../../../engine/models/ecs/entity.js');

var Inventory = require('./inventory.js');
var Equipment = require('./player_equipment.js');
var Stats = require('./player_stats.js');

class Player extends Model {
    get defaults() {
        return {
            stats: null,
            equipment: null,
            inventory: null,
            character_entity: null
        };
    }
    get types() {
        return {
            stats: Stats,
            equipment: Equipment,
            inventory: Inventory,
            character_entity: Entity
        };
    }
    constructor(options) {
        super(options);
    }
}

module.exports = Player;
