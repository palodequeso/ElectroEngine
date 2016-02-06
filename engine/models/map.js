'use strict';

var Model = require('../../lib/model.js');
var MapLayers = require('./map_layers.js');
var CollisionLayer = require('./collision_layer.js');
var EntityLayer = require('./entity_layer.js');
var SpriteSheets = require('./sprite_sheets.js');

class Map extends Model {
    get defaults() {
        return {
            name: '',
            width: 0,
            height: 0,
            layers: null,
            collision_layer: null,
            entity_layer: null,
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
        if (this.entity_layer === null) {
            this.entity_layer = {};
        }
        if (this.sprite_sheets === null) {
            this.sprite_sheets = [];
        }

        this.layers = new MapLayers(this.layers);
        this.collision_layer = new CollisionLayer(this.collision_layer);
        this.entity_layer = new EntityLayer(this.entity_layer);
        this.sprite_sheets = new SpriteSheets(this.sprite_sheets);
    }
}

module.exports = Map;
