'use strict';

var Model = require('exo').Model;

class MapLayer extends Model {
    get defaults() {
        return {
            name: '',
            tiles: [], // array of map_tile IDs
            width: 0,
            height: 0,
            type: 'tiles' // or 'background'
        };
    }
    get types() {
        return {
            //
        };
    }
    constructor(data) {
        super(data);
    }
}

module.exports = MapLayer;
