'use strict';

var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var mkdirp = require('mkdirp');

class TiledMapConverter {
    constructor(map_path, out_path) {
        this.map_path = map_path;
        this.out_path = out_path;
    }
    convert() {
        //
    }
}

module.exports = TiledMapConverter;
