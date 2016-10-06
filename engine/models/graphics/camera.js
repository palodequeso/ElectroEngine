'use strict';

var glmatrix = require("gl-matrix");
var Model = require('exo').Model;

class Camera extends Model {
    get defaults() {
        return {
            position: [0, 0],
            scale: [1, 1],
            resolution: [650, 500],
            view_matrix: null
        };
    }
    constructor(data) {
        super(data);
        this.view_matrix = glmatrix.mat4.create();
    }
    calculate_matrix(force) {
        if (!force) {
            force = false;
        }
        glmatrix.mat4.identity(this.view_matrix);
        glmatrix.mat4.translate(this.view_matrix, this.view_matrix,
            [this.position[0], this.position[1], 0.0]);
        glmatrix.mat4.scale(this.view_matrix, this.view_matrix, [
            this.scale[0], this.scale[1], 1.0
        ]);
    }
}

module.exports = Camera;
