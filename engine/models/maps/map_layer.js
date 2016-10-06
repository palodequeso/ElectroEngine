'use strict';

var Model = require('exo').Model;
var SpriteSheet = require('../graphics/sprite_sheet.js');

// NOTE: I think this might need an instance version as well since it has sprite_instances, and can be used in many
//   different map instances.
// TODO: Add ability for map layer to just be a background image as well, with scaling!
// TODO: Add ability for map layers to scroll at different speeds, creating parallax
class MapLayer extends Model {
    get defaults() {
        return {
            name: '',
            tiles: [],
            sprite_sheet: null,
            width: 0,
            height: 0,
            type: 'tiles' // or 'background'
        };
    }
    get types() {
        return {
            sprite_sheet: SpriteSheet
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = MapLayer;
