'use strict';

var fs = require('fs');
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

var RPGGameplaySystem = require('./src/gameplay/gameplay.js');

var SaveGames = require('./src/ui/models/save_games.js');
var TitleView = require('./src/ui/views/title.js');

function read_saves() {
    var out = [];
    var save_files = fs.readdirSync(path.join(__dirname, 'saves'));
    save_files.forEach(save_file => {
        out.push(JSON.parse(fs.readFileSync(path.join(__dirname, 'saves', save_file), 'utf-8')));
    });
    return out;
}

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
    game.running = false;

    var save_games = new SaveGames(read_saves());
    var title = new TitleView({collection: save_games});
    title.on('new_game', () => {
        //
    });
    title.on('continue_game', () => {
        //
    });
    title.on('game_options', () => {
        //
    });
    title.on('exit_game', () => {
        //
    });
    title.render();

    document.querySelector('body').appendChild(title.element);
});
