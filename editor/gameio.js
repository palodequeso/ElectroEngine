'use strict';

var fs = require('fs');
var path = require('path');

var Game = require('../engine/models/game.js');
var Maps = require('../engine/models/maps.js');
var Entities = require('../engine/models/entities.js');
var ParticleSystems = require('../engine/models/particle_systems.js');

function load(folder_path) {
    var game_data = JSON.parse(fs.readFileSync(path.normalize(folder_path + '/game.json')));
    console.log("Loaded Game Data: ", game_data);
    var game = new Game(game_data);

    game.path = folder_path;
    // game.maps = new Maps();
    // game.entities = new Entities();
    // game.particle_systems = new ParticleSystems();
    console.log(game);

    return game;
}

function save(game_model) {
    var game_data = game_model.serialize();
    console.log("Saved Game Data: ", game_data);
    fs.writeFileSync(path.normalize(path.join(game_data.path, 'game.json')), JSON.stringify(game_data));
}

module.exports = {
    load: load,
    save: save
};
