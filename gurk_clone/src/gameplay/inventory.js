'use strict';

const Collection = require('exo').Collection;

const InventoryItem = require('./inventory_item.js');

class Inventory extends Collection {
    get model() {
        return InventoryItem;
    }
}

module.exports = Inventory;
