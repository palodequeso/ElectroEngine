'use strict';

var Model = require('../../../lib/model.js');
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
    constructor(data) {
        super(data);

        if (this.layers === null) {
            this.layers = [];
        }
        if (this.collision_layer === null) {
            this.collision_layer = {};
        }
        if (this.characters === null) {
            this.characters = [];
        }
        if (this.sprite_sheets === null) {
            this.sprite_sheets = [];
        }

        this.layers = new MapLayers(this.layers);
        this.collision_layer = new CollisionLayer(this.collision_layer);
        this.characters = new Characters(this.characters);
        this.sprite_sheets = new SpriteSheets(this.sprite_sheets);
    }
}

module.exports = Map;