'use strict';

var Model = require('exo').Model;
var CollisionLayer = require('./collision_layer.js');
var MapLayers = require('./map_layers.js');
var Characters = require('../characters/characters.js');
var SpriteSheets = require('../graphics/sprite_sheets.js');

class Map extends Model {
    get defaults() {
        return {
            name: '',
            width: 16,
            height: 16,
            tile_width: 32,
            tile_height: 32,
            layers: null,
            entity_layer_index: 0,
            collision_layer: null,
            characters: null,
            sprite_sheets: null
        };
    }
    get types() {
        return {
            layers: MapLayers,
            collision_layer: CollisionLayer,
            characters: Characters,
            sprite_sheets: SpriteSheets
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = Map;
