'use strict';

var fs = require('fs');
var path = require('path');

var Game = require('../engine/models/game.js');
var Maps = require('../engine/models/maps.js');
var Entities = require('../engine/models/entities.js');
var ParticleSystems = require('../engine/models/particle_systems.js');

function load(folder_path) {
    var game_data = JSON.parse(fs.readFileSync(path.normalize(folder_path + '/game.json')));
    var game = new Game(game_data);

    game.path = folder_path;
    game.maps = new Maps();
    game.entities = new Entities();
    game.particle_systems = new ParticleSystems();

    return game;
}

function save(game_model) {
    //
}

module.exports = {
    load: load,
    save: save
};
