'use strict';

var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var mkdirp = require('mkdirp');

var Map = require('../engine/models/maps/map.js');
var MapTile = require('../engine/models/maps/map_tile.js');
var MapLayer = require('../engine/models/maps/map_layer.js');
var CollisionLayer = require('../engine/models/maps/collision_layer.js');

class TiledMapConverter {
    constructor(map_path, out_path) {
        this.map_path = map_path;
        this.out_path = out_path;

        this.data = null;
        this.unique_tiles = null;
        this.map = new Map();

        // Need a lookup, not a HACK!
        this.sprite_sheets = {};
        this.sprite_sheet_end_ids = [];
    }
    convert() {
        var contents = fs.readFileSync(this.map_path, 'utf-8');
        this.data = JSON.parse(contents);

        this.load_sprite_sheets();
        this.load_map_data();
        this.load_layers();
        this.combine_data();
        this.save();
    }
    save() {
        try {
            mkdirp.sync(path.join(this.out_path, 'images', 'sprite_sheets'));
            mkdirp.sync(path.join(this.out_path, 'maps'));
            mkdirp.sync(path.join(this.out_path, 'sprite_sheets'));
            mkdirp.sync(path.join(this.out_path, 'sprites'));
        } catch (exception) {
            console.error("Failed to create out directories!", exception);
            return;
        }

        Object.keys(this.sprite_sheets).forEach(start_tile_id => {
            var sprite_sheet = this.sprite_sheets[start_tile_id];
            var sheet_path = path.basename(sprite_sheet.image);
            var full_sheet_path = path.resolve(path.normalize(path.join(path.dirname(this.map_path),
                                                                        sprite_sheet.image)));
            fs.createReadStream(full_sheet_path).pipe(fs.createWriteStream(path.join(
                this.out_path, 'images', 'sprite_sheets', sheet_path)));
        });

        Object.keys(this.sprite_sheets).forEach(start_tile_id => {
            var sprite_sheet = this.sprite_sheets[start_tile_id];
            fs.writeFileSync(path.join(this.out_path, 'sprite_sheets', sprite_sheet.name + '.json'),
                JSON.stringify({
                    id: sprite_sheet.id,
                    name: sprite_sheet.name,
                    path: sprite_sheet.path,
                    width: sprite_sheet.width,
                    height: sprite_sheet.height,
                    tile_width: sprite_sheet.tile_width,
                    tile_height: sprite_sheet.tile_height,
                }, null, 4)
            );
            console.log(sprite_sheet);
        });

        var serialized = this.map.serialize();
        console.log(serialized);

        fs.writeFileSync(path.join(this.out_path, 'maps', this.map.name + '.json'),
            JSON.stringify(serialized));
    }
    load_map_data() {
        var name = path.basename(this.map_path).slice(0, -5);
        console.log(`${this.map_path} => ${name}`);
        this.map.id = name;
        this.map.name = name;
        this.map.width = this.data.width;
        this.map.height = this.data.height;
        this.map.tile_width = this.data.tilewidth;
        this.map.tile_height = this.data.tileheight;
        this.map.character_layer_index = 1; // TODO: Pull from some standardized tiled data.
        console.log(this.map);
    }
    load_sprite_sheets() {
        this.data.tilesets.forEach(tileset => {
            var sheet_path = path.basename(tileset.image);
            var sprite_sheet = {
                id: tileset.name,
                name: tileset.name,
                path: sheet_path,
                width: tileset.imagewidth,
                height: tileset.imageheight,
                tile_width: tileset.tilewidth,
                tile_height: tileset.tileheight,
                image: tileset.image,
                firstgid: tileset.firstgid,
                tilecount: tileset.tilecount
            };
            this.sprite_sheets[tileset.firstgid + tileset.tilecount] = sprite_sheet;
        });
        this.sprite_sheet_end_ids = Object.keys(this.sprite_sheets);
        this.sprite_sheet_end_ids.sort((a, b) => {
            return a - b;
        });
    }
    load_layers() {
        this.data.layers.forEach(layer => {
            if (!layer.hasOwnProperty('data')) {
                return;
            }

            var zipped = new Buffer(layer.data.trim(), 'base64');
            var buffer = zlib.inflateSync(zipped);
            var tiles = [];
            var tile_count = this.map.width * this.map.height * 4;
            var tile_value;
            var tile_index;
            var i = 0;
            var x;
            var y;

            if (layer.name === 'collisions') {
                tile_index = 0;
                var collision_layer = new CollisionLayer();
                collision_layer.tiles_x = layer.width;
                collision_layer.tiles_y = layer.height;
                for (i = 0; i < tile_count; i += 4) {
                    tile_value = buffer.readUInt32LE(i);
                    if (tile_value !== 0) {
                        y = Math.floor(tile_index / layer.width);
                        x = tile_index - (y * layer.width);
                        if (!collision_layer.blocks.hasOwnProperty(x)) {
                            collision_layer.blocks[x] = {};
                        }
                        collision_layer.blocks[x][y] = true;
                    }
                    tile_index += 1;
                }
                collision_layer.recalculate_easystar_grid();
                this.map.collision_layer = collision_layer;
                return;
            }

            for (i = 0; i < tile_count; i += 4) {
                tile_value = buffer.readUInt32LE(i);
                tiles.push(tile_value);
                var sprite_sheet_end_id = null;
                this.sprite_sheet_end_ids.forEach(end_id => {
                    if (sprite_sheet_end_id === null && tile_value < end_id) {
                        sprite_sheet_end_id = end_id;
                    }
                });

                var sprite_sheet = this.sprite_sheets[sprite_sheet_end_id];
                var map_tile = this.map.map_tiles.get(tile_value);
                if (!map_tile) {
                    tile_index = tile_value - sprite_sheet.firstgid;
                    var row = Math.floor((tile_index * sprite_sheet.tile_width) / sprite_sheet.width);
                    y = row * sprite_sheet.tile_height;
                    x = tile_index * sprite_sheet.tile_width - (row * sprite_sheet.width);

                    this.map.map_tiles.add(new MapTile({
                        id: tile_value,
                        sprite_sheet_id: sprite_sheet.id,
                        total_animation_duration: 0,
                        frames: [{
                            css_offset_x: x,
                            css_offset_y: y,
                            duration: 0
                        }]
                    }));
                }
            }
            layer.tiles = tiles;
        });
    }
    combine_data() {
        this.data.layers.forEach((layer) => {
            if (layer.type === 'tilelayer') {
                var layer_data = {
                    id: layer.name,
                    name: layer.name,
                    tiles: layer.tiles,
                    width: layer.width,
                    height: layer.height,
                    type: 'tiles'
                };
                this.map.layers.add(new MapLayer(layer_data));
            } else if (layer.type === 'objectgroup') {
                layer.objects.forEach((object) => {
                    var object_width = object.width;
                    var object_height = object.height;
                    var object_x = object.x;
                    var object_y = (map.tile_height * layer.height) - object.y;
                    var body = {
                        mass: 0.0,
                        is_dynamic: false,
                        collision_group: "maps",
                        collision_rect: [object_width, object_height],
                        shapes: [
                            {
                                type: "box",
                                top_left: [-(object_width / 2.0), object_height / 2.0],
                                bottom_right: [object_width / 2.0, -(object_height / 2.0)],
                                angle: parseFloat(object.rotation),
                                offset: [0, 0]
                            }
                        ],
                        position: [object_x + (object_width / 2.0), object_y + (object_height / 2.0)]
                    };
                    this.map.bodies.push(body);
                });
            }
        });
    }
}

module.exports = TiledMapConverter;
