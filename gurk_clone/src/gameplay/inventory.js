'use strict';

var Collection = require('exo').Collection;

var InventoryItem = require('./inventory_item.js');

class Inventory extends Collection {
    get model() {
        return InventoryItem;
    }
}

module.exports = Inventory;
