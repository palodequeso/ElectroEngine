'use strict';

const Model = require('exo').Model;

var PartyMembers = require('./party_members.js');

class Enemy extends Model {
    get defaults() {
        return {
            character_entity: null
        };
    }
    get types() {
        return {
            character_entity: Entity
        };
    }
}

module.exports = Enemy;
