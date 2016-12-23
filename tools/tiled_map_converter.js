'use strict';

// var fs = require('fs');
var path = require('path');
// var zlib = require('zlib');
// var mkdirp = require('mkdirp');

var TiledMapConverter = require('./converter.js');

// TODO: Rewrite into a class and runner!

var map_path = process.argv[2];
var out_path = process.argv[3];

map_path = path.resolve(path.normalize(map_path));
out_path = path.resolve(path.normalize(out_path));

var converter = new TiledMapConverter(map_path, out_path);
converter.convert();

//
// var contents = fs.readFileSync(map_path, 'utf-8');
// var data = JSON.parse(contents);
// var map = {
//     id: 'test',
//     name: 'test',
//     width: data.width, // tiles x
//     height: data.height, // tiles y
//     tile_width: data.tilewidth,
//     tile_height: data.tileheight,
//     character_layer_index: 1,
//     layers: [],
//     bodies: []
// };
// data.layers.forEach((layer) => {
//     if (layer.type === 'tilelayer') {
//         var new_tiles = [];
//         layer.tiles.forEach((tile_index) => {
//             new_tiles.push(tileset_id + '_' + tile_index);
//         })
//         var layer_data = {
//             id: layer.name,
//             name: layer.name,
//             tiles: new_tiles,
//             sprite_sheet_id: tileset_id, // NOTE: Only one is supported at the moment.
//             width: layer.width,
//             height: layer.height
//         };
//         map.layers.push(layer_data);
//     } else if (layer.type === 'objectgroup') {
//         layer.objects.forEach((object) => {
//             var object_width = object.width;
//             var object_height = object.height;
//             var object_x = object.x;
//             var object_y = (map.tile_height * layer.height) - object.y;
//             var body = {
//                 mass: 0.0,
//                 is_dynamic: false,
//                 collision_group: "maps",
//                 collision_rect: [object_width, object_height],
//                 shapes: [
//                     {
//                         type: "box",
//                         top_left: [-(object_width / 2.0), object_height / 2.0],
//                         bottom_right: [object_width / 2.0, -(object_height / 2.0)],
//                         angle: parseFloat(object.rotation),
//                         offset: [0, 0]
//                     }
//                 ],
//                 position: [object_x + (object_width / 2.0), object_y + (object_height / 2.0)]
//             };
//             map.bodies.push(body);
//         });
//     }
// });
//
// fs.writeFileSync(path.join(out_path, 'maps',
//     map.name + '.json'), JSON.stringify(map, null, 4));
//
// // Import other info as well!
