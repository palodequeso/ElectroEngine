'use strict';

var Model = require('exo').Model;

class Component extends Model {
    get defaults() {
        return {
            type: 'default'
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Component;
