'use strict';

const Model = require('exo').Model;

class PlayerEquipment extends Model {
    get defaults() {
        return {
            helmet: null,
            armor: null,
            boots: null,
            gloves: null,
            left_hand: null,
            right_hand: null,
            neck: null,
            left_finger: null,
            right_finger: null,
            back: null
        };
    }
    constructor(options) {
        super(options);
    }
}

module.exports = PlayerEquipment;
