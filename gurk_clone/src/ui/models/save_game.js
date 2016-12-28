'use strict';

const Model = require('exo').Model;
const Party = require('../../gameplay/party.js');

class SaveGame extends Model {
    get defaults() {
        return {
            party: null
        };
    }
    get types() {
        return {
            party: Party
        };
    }
}

module.exports = SaveGame;
