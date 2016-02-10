'use strict';

var EasyStar = require('easystarjs');
var Model = require('../../lib/model.js');

class CollisionLayer extends Model {
    get defaults() {
        return {
            tiles_x: 0,
            tiles_y: 0,
            tile_width: 0,
            tile_height: 0,
            image_width: 0,
            image_height: 0,
            blocks: null,
            easystar_grid: null
        };
    }
    constructor(data) {
        super(data);
        this.easystar = null;
    }
    find_path(position, end_position, callback) {
        if (this.easystar === null) {
            this.easystar = new EasyStar.js();
            this.easystar.setGrid(this.easystar_grid);
            this.easystar.setAcceptableTiles([0]);
            this.easystar.setIterationsPerCalculation(100);
        }
        this.easystar.findPath(position[0], position[1], end_position[0], end_position[1], (path) => {
            callback(path);
        });
        this.easystar.calculate();
    }
    check_collision(position, velocity, dimensions) {
        // NOTE: position is top left of collision rect.
        var tile_width = this.tile_width;
        var tile_height = this.tile_height;

        var new_position = [
            position[0] + velocity[0],
            position[1] + velocity[1]
        ];

        var mid_point = [
            new_position[0] + (dimensions[0] / 2.0),
            new_position[1] + (dimensions[1] / 2.0)
        ];
        var closest = [
            Math.floor(mid_point[0] / tile_width),
            Math.floor(mid_point[1] / tile_height)
        ];

        // In the center of a tile!
        if (closest[0] === position[0] / tile_width && closest[1] === position[1] / tile_height) {
            return [0, 0];
        }

        var rounded = [
            Math.round(mid_point[0] / tile_width),
            Math.round(mid_point[1] / tile_height)
        ];

        var tiles = {};
        if (rounded[0] === closest[0]) {
            tiles.left = [closest[0] - 1, closest[1]];
        } else {
            tiles.right = [closest[0] + 1, closest[1]];
        }
        if (rounded[1] === closest[1]) {
            tiles.top = [closest[0], closest[1] - 1];
        } else {
            tiles.bottom = [closest[0], closest[1] + 1];
        }

        var pos_left = position[0];
        var pos_right = pos_left + dimensions[0];
        var pos_top = position[1];
        var pos_bottom = pos_top + dimensions[1];

        var collision = [0, 0];
        Object.keys(tiles).forEach((direction) => {
            var tile = tiles[direction];
            var x = tile[0];
            var y = tile[1];

            if (!this.blocks.hasOwnProperty(x) || !this.blocks[x].hasOwnProperty(y) || !this.blocks[x][y]) {
                return;
            }

            var tile_left = x * tile_width;
            var tile_right = tile_left + tile_width;
            var tile_top = y * tile_height;
            var tile_bottom = tile_top + tile_height;

            if (direction === "top") {
                collision[1] = tile_bottom - pos_top;
            }

            if (direction === "bottom") {
                collision[1] = tile_top - pos_bottom;
            }

            if (direction === "left") {
                collision[0] = tile_right - pos_left;
            }

            if (direction === "right") {
                collision[0] = tile_left - pos_right;
            }
        });

        return collision;
    }
}

module.exports = CollisionLayer;
