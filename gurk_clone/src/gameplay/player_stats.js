'use strict';

const Model = require('exo').Model;

class PlayerStats extends Model {
    get defaults() {
        return {
            max_health: 0,
            health: 0,
            max_mana: 0,
            mana: 0,
            level: 0,
            experience: 0,
            strength: 0,
            constitution: 0,
            dexterity: 0,
            agility: 0,
            knowledge: 0,
            intellect: 0,
            charisma: 0
        };
    }
    constructor(options) {
        super(options);
    }
}

module.exports = PlayerStats;
