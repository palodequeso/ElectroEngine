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
            strength: 8,
            constitution: 8,
            dexterity: 8,
            agility: 8,
            knowledge: 8,
            intellect: 8,
            charisma: 8,
            max_stats: 84
        };
    }
    constructor(options) {
        super(options);
    }
}

module.exports = PlayerStats;
