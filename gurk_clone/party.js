'use strict';

var Model = require('exo').Model;

class Party extends Model {
    get defaults() {
        return {
            members: [],
            current_active: 0,
            mode: 'battle' // or 'travel' (which is just one character like other RPGs)
        };
    }
}

module.exports = Party;
