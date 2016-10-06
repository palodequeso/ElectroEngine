'use strict';

var Model = require('exo').Model;
var Components = require('./components.js');

class Entity extends Model {
    get defaults() {
        return {
            components: null
        };
    }
    get types() {
        return {
            components: Components
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Entity;
