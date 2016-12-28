'use strict';

const Collection = require('exo').Collection;

const Player = require('./player.js');

class PartyMembers extends Collection {
    get model() {
        return Player;
    }
}

module.exports = PartyMembers;
