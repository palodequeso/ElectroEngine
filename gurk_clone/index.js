'use strict';

var path = require("path");
var GameModel = require('../engine/models/game.js');
var Game = require('../engine/views/game.js');
var gameio = require('../engine/util/gameio.js');

var AudioSystem = require('../engine/models/systems/audio.js');
var GraphicsSystem = require('../engine/models/systems/graphics.js');
var MapSystem = require('../engine/models/systems/map.js');
var PhysicsSystem = require('../engine/models/systems/physics.js');
var Systems = require('../engine/models/ecs/systems.js');

var BasicPhysics = require('../engine/models/physics/basic_physics.js');

var RPGGameplaySystem = require('./gameplay.js');

document.addEventListener("DOMContentLoaded", () => {
    var game_systems = new Systems();
    game_systems.add(new AudioSystem());
    game_systems.add(new RPGGameplaySystem());
    game_systems.add(new GraphicsSystem());
    game_systems.add(new MapSystem());
    game_systems.add(new PhysicsSystem({engine: new BasicPhysics(), type: 'basic'}));
    var game_loader = new gameio.GameLoader(path.normalize("gurk_clone/data"), GameModel, game_systems);

    game_loader.game.camera.resolution = [128, 128];
    game_loader.game.camera.scale = [4, 4];

    game_loader.game.set_current_map_instance('overworld_1_forest');
    var game = new Game({
        model: game_loader.game,
        resolution: [128, 128]
    });
    game.run();
});
