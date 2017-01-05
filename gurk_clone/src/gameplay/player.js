'use strict';

const Model = require('exo').Model;

const Entity = require('../../../engine/models/ecs/entity.js');

const Inventory = require('./inventory.js');
const PlayerEquipment = require('./player_equipment.js');
const PlayerStats = require('./player_stats.js');

class Player extends Model {
    get defaults() {
        return {
            name: '',
            class: '',
            stats: null,
            equipment: null,
            inventory: null,
            character_entity: null
        };
    }
    get types() {
        return {
            stats: PlayerStats,
            equipment: PlayerEquipment,
            inventory: Inventory,
            character_entity: Entity
        };
    }
    constructor(options) {
        super(options);
    }
}

module.exports = Player;
