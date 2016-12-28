'use strict';

var Model = require('exo').Model;

var PartyMembers = require('./party_members.js');

class Party extends Model {
    get defaults() {
        return {
            members: null,
            current_active: 0,
            mode: 'battle' // or 'travel' (which is just one character like other RPGs)
        };
    }
    get types() {
        return {
            members: PartyMembers
        };
    }
}

module.exports = Party;
