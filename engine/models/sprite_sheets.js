'use strict';

var Collection = require('../../lib/collection.js');
var Map = require('./sprite_sheet.js');

class SpriteSheets extends Collection {
    get model() {
        return SpriteSheet;
    }
    constructor(data) {
        super(data);
    }
}

module.exports = SpriteSheets;
