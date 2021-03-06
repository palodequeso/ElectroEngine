'use strict';

var Collection = require('exo').Collection;
var SpriteSheet = require('./sprite_sheet.js');

class SpriteSheets extends Collection {
    get model() {
        return SpriteSheet;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = SpriteSheets;
