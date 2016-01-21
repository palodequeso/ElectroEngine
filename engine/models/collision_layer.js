'use strict';

class CollisionLayer {
    constructor() {
        this.tiles_x = 0;
        this.tiles_y = 0;
        this.tile_width = 0;
        this.tile_height = 0;
        this.image_width = 0;
        this.image_height = 0;
        this.blocks = null;
        this.easystar_grid = null;
    }
}

module.exports = CollisionLayer;
