'use strict';

var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var mkdirp = require('mkdirp');

// TODO: Rewrite into a class and runner!

var map_path = process.argv[2];
var out_path = process.argv[3];

map_path = path.resolve(path.normalize(map_path));
out_path = path.resolve(path.normalize(out_path));

var contents = fs.readFileSync(map_path, 'utf-8');
var data = JSON.parse(contents);

console.log(data);

function convert_index_to_coords(index, width, height, tile_width, tile_height) {
    var tiles_x = Math.floor(width / tile_width);
    var row = Math.floor(index / tiles_x);
    var col = index % tiles_x;
    return [col * tile_width, row * tile_height];
}

try {
    mkdirp.sync(path.join(out_path, 'images', 'sprite_sheets'));
    mkdirp.sync(path.join(out_path, 'maps'));
    mkdirp.sync(path.join(out_path, 'sprite_sheets'));
    mkdirp.sync(path.join(out_path, 'sprites'));
} catch(exception) {
    process.exit();
}

var map = {
    id: 'test',
    name: 'test',
    width: data.width, // tiles x
    height: data.height, // tiles y
    tile_width: data.tilewidth,
    tile_height: data.tileheight,
    character_layer_index: 1,
    layers: [],
    bodies: []
};

var unique_tiles = [];
data.layers.forEach((layer) => {
    if (!layer.hasOwnProperty('data')) {
        return;
    }

    var zipped = new Buffer(layer.data.trim(), 'base64');
    var buffer = zlib.inflateSync(zipped);
    var tiles = [];
    var tile_count = map.width * map.height * 4;
    for (var i = 0; i < tile_count; i += 4) {
        var tile_value = buffer.readUInt32LE(i);
        tiles.push(tile_value);
        if (unique_tiles.indexOf(tile_value) === -1) {
            unique_tiles.push(tile_value);
        }
    }
    layer.tiles = tiles;
});

var tileset_id = null;
data.tilesets.forEach((tileset) => {
    // load into sprite sheet json files, as well as sprite json files
    // Then save them out and use as reference in the map file

    var sheet_path = path.basename(tileset.image);
    var full_sheet_path = path.resolve(path.normalize(path.join(path.dirname(map_path), tileset.image)));

    fs.createReadStream(full_sheet_path).pipe(fs.createWriteStream(path.join(
        out_path, 'images', 'sprite_sheets', sheet_path)));

    tileset_id = tileset.name;
    var sprite_sheet = {
        id: tileset.name,
        name: tileset.name,
        path: sheet_path,
        width: tileset.imagewidth,
        height: tileset.imageheight,
        tile_width: tileset.tilewidth,
        tile_height: tileset.tileheight
    };

    fs.writeFileSync(path.join(out_path, 'sprite_sheets', tileset.name + '.json'),
        JSON.stringify(sprite_sheet, null, 4));

    var sprites = [];
    if (tileset.hasOwnProperty('tiles')) {
        tileset.tiles.forEach((tile) => {
            // TODO Created Animated Tile Sprite
        });
    }

    // Sprite sheet saved, now work on the sprites themselves.
    // but only create sprites for animated tiles, and tiles that are actually used,
    //   so this has to wait until the layers are decoded haha
    console.log(unique_tiles);
    unique_tiles.forEach((tile_index) => {
        if (tile_index === 0) {
            return;
        }

        // TODO Created Non-Animated Tile Sprite
        var result = convert_index_to_coords(tile_index - 1, tileset.imagewidth,
            tileset.imageheight, tileset.tilewidth, tileset.tileheight);
        sprites.push({
            id: tile_index,
            sprite_sheet_id: tileset.name,
            animations: {},
            tiles: [{css_offset_x: result[0], css_offset_y: result[1]}],
            width: 32,
            height: 32
        });
    });

    fs.writeFileSync(path.join(out_path, 'sprites',
        tileset.name + '_sprites.json'), JSON.stringify(sprites, null, 4));
});

data.layers.forEach((layer) => {
    if (layer.type === 'tilelayer') {
        var layer_data = {
            id: layer.name,
            name: layer.name,
            tiles: layer.tiles,
            sprite_sheet_id: tileset_id, // NOTE: Only one is supported at the moment.
            width: layer.width,
            height: layer.height
        };
        map.layers.push(layer_data);
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
            map.bodies.push(body);
        });
    }
});

fs.writeFileSync(path.join(out_path, 'maps',
    map.name + '.json'), JSON.stringify(map, null, 4));

// Import other info as well!
