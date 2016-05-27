'use strict';

var Model = require('../../../lib/model.js');
var SpriteSheet = require('../graphics/sprite_sheet.js');

// NOTE: I think this might need an instance version as well since it has sprite_instances, and can be used in many
//   different map instances.
class MapLayer extends Model {
    get defaults() {
        return {
            name: '',
            tiles: [],
            sprite_sheet: null,
            width: 0,
            height: 0
        };
    }
    constructor(data) {
        super(data);

        if (this.sprite_sheet === null) {
            this.sprite_sheet = {};
        }
        this.sprite_sheet = new SpriteSheet(this.sprite_sheet);
    }
}

module.exports = MapLayer;
