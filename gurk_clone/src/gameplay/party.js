'use strict';

const Model = require('exo').Model;

const PartyMembers = require('./party_members.js');

class Party extends Model {
    get defaults() {
        return {
            members: null,
            current_active: 0,
            mode: 'travel' // or 'battle'
        };
    }
    get types() {
        return {
            members: PartyMembers
        };
    }
}

module.exports = Party;
