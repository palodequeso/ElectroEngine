'use strict';

const fs = require('fs');
const path = require("path");
const process = require('process');

const GameModel = require('../engine/models/game.js');
const Party = require('./src/gameplay/party.js');

const Game = require('../engine/views/game.js');
const gameio = require('../engine/util/gameio.js');

const AudioSystem = require('../engine/models/systems/audio.js');
const GraphicsSystem = require('../engine/models/systems/graphics.js');
const MapSystem = require('../engine/models/systems/map.js');
const PhysicsSystem = require('../engine/models/systems/physics.js');
const Systems = require('../engine/models/ecs/systems.js');

const BasicPhysics = require('../engine/models/physics/basic_physics.js');

const RPGGameplaySystem = require('./src/gameplay/gameplay.js');

const SaveGames = require('./src/ui/models/save_games.js');
const TitleView = require('./src/ui/views/title.js');
const NewGameView = require('./src/ui/views/new_game.js');

function read_saves() {
    const out = [];
    const save_files = fs.readdirSync(path.join(__dirname, 'saves'));
    save_files.forEach(save_file => {
        out.push(JSON.parse(fs.readFileSync(path.join(__dirname, 'saves', save_file), 'utf-8')));
    });
    return out;
}

document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector('body');
    const game_systems = new Systems();
    const gameplay = new RPGGameplaySystem();
    game_systems.add(new AudioSystem());
    game_systems.add(gameplay);
    game_systems.add(new GraphicsSystem());
    game_systems.add(new MapSystem());
    game_systems.add(new PhysicsSystem({engine: new BasicPhysics(), type: 'basic'}));
    const game_loader = new gameio.GameLoader(path.normalize("gurk_clone/data"), GameModel, game_systems);

    game_loader.game.camera.resolution = [128, 128];
    game_loader.game.camera.scale = [4, 4];

    game_loader.game.set_current_map_instance('overworld_1_forest');
    const game = game_loader.game;
    const game_view = new Game({
        model: game,
        resolution: [128, 128]
    });
    game_view.run();
    game_view.running = false;

    const save_games = new SaveGames(read_saves());
    const title = new TitleView({collection: save_games});
    title.on('new_game_out', () => {
        const new_game_view = new NewGameView();
        new_game_view.on('done', players => {
            // Set the party to the current gameplay class.
            gameplay.party.members.reset(players);
            // Remove the new game view.
            new_game_view.element.parentNode.removeChild(new_game_view.element);

            // Create a copy of the game template.
            const game_template = JSON.parse(fs.readFileSync(path.join(__dirname, 'game_template.json'), 'utf-8'));
            // Set the players, for saving.
            game_template.party = players;
            // Generate a new game unique file for saves.
            let save_filename = `${new Date().toISOString()}-${players[0].name}-${players[1].name}-${players[2].name}-${players[3].name}`;
            // Save that file to the saves dir.
            const save_file_path = path.join(__dirname, 'saves', `${save_filename}.json`);
            fs.writeFileSync(save_file_path, JSON.stringify(game_template, null, 2));

            // Set the game to start running.
            game_view.running = true;
            game_view.run();
        });
        new_game_view.render();
        title.element.parentNode.removeChild(title.element);
        body.appendChild(new_game_view.element);
        // gameplay.new_game(__dirname);
    });
    title.on('continue_game', () => {
        gameplay.continue_game();
    });
    title.on('game_options', () => {
        //
    });
    title.on('exit_game', () => {
        process.exit();
    });
    title.render();

    body.appendChild(title.element);
});
