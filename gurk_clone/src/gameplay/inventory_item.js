'use strict';

const Model = require('exo').Model;

class InventoryItem extends Model {
    get defeaults() {
        return {
            name: '',
            equippable: false,
            body_slots: null, // []
            damage: null, // []
            hit_bonus: null, // 0
            armor: null, // 0 - 5
            quest_item: false,
            associated_quest: null
        };
    }
}

module.exports = InventoryItem;
