'use strict';

var Collection = require('../../lib/collection.js');
var EntityInstance = require('./entity_instance.js');

class EntityInstances extends Collection {
    get model() {
        return EntityInstance;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = EntityInstances;
