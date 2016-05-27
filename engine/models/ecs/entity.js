'use strict';

var Model = require('../../../lib/model.js');
var Components = require('./components.js');

class Entity extends Model {
    get defaults() {
        return {
            components: null
        };
    }
    constructor(data) {
        super(data);

        if (this.components === null) {
            this.components = [];
        }
        this.components = new Components(this.components);
    }
}

module.exports = Entity;
