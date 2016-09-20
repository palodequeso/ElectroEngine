'use strict';

var Model = require('../../../lib/model.js');

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
