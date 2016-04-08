'use strict';

var Model = require('../../lib/model.js');
var MapLayers = require('./map_layers.js');
var Entities = require('./entities.js');
var CollisionLayer = require('./collision_layer.js');
var SpriteSheets = require('./sprite_sheets.js');

class Map extends Model {
    get defaults() {
        return {
            name: '',
            width: 16,
            height: 16,
            tile_width: 32,
            tile_height: 32,
            layers: null,
            collision_layer: null,
            entities: null,
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
        if (this.entities === null) {
            this.entities = [];
        }
        if (this.sprite_sheets === null) {
            this.sprite_sheets = [];
        }

        this.layers = new MapLayers(this.layers);
        this.collision_layer = new CollisionLayer(this.collision_layer);
        this.entities = new Entities(this.entities);
        this.sprite_sheets = new SpriteSheets(this.sprite_sheets);
    }
}

module.exports = Map;
