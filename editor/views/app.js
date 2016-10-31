'use strict';

const {dialog} = require('electron').remote;

var View = require('exo').View;

var game_model = require('../../engine/models/game.js');
var game_views = require('./game.js');
var gameio = require('../../engine/util/gameio.js');

var Map = require('../../engine/models/maps/map.js');
var MapEditor = require('./map.js');

var SpriteSheet = require('../../engine/models/graphics/sprite_sheet.js');
var SpriteSheetEditor = require('./sprite_sheet.js');

var Character = require('../../engine/models/characters/character.js');
var CharacterEditor = require('./character.js');

var ParticleSystem = require('../../engine/models/particle_systems/particle_system.js');
var ParticleSystemEditor = require('./particle_system.js');

class App extends View {
    get events() {
        return {
            'click #edit_game_button': this.edit_game.bind(this),
            'click #save_game_button': this.save_game.bind(this),
            'click #build_game_button': this.build_game.bind(this),
            'click #create_game_button': this.create_game.bind(this),
            'click #load_game_button': this.load_game.bind(this),
            'click #create_map_button': this.create_map.bind(this),
            'click #create_sprite_sheet_button': this.create_sprite_sheet.bind(this),
            'click #create_particle_system_button': this.create_particle_system.bind(this),
            'click #create_character_button': this.create_character.bind(this),
            'click .select_map': this.select_map.bind(this),
            'click .select_character': this.select_character.bind(this),
            'click .select_particle_system': this.select_particle_system.bind(this),
            'click .select_sprite_sheet': this.select_sprite_sheet.bind(this)
        };
    }
    constructor(options) {
        super(options);
        this.game_model = null;
    }
    edit_game() {
        //
    }
    save_game() {
        gameio.save(this.game_model);
    }
    build_game() {
        //
    }
    create_game() {
        var gv = new game_views.CreateGameView({
            model: new game_model()
        });
        gv.render();

        gv.once('created', () => {
            this.game_model = gv.model;
            this.render();
        });

        this.element.querySelector(".content").innerHTML = '';
        this.element.querySelector(".content").appendChild(gv.element);
    }
    load_game() {
        var choice = dialog.showOpenDialog({properties: ['openDirectory']});
        console.log("Game Folder: ", choice);
        var game_loader = new gameio.GameLoader(choice[0], game_model);
        // var result = gameio.load(choice[0], game_model);
        console.log(choice[0], game_loader.game);
        this.game_model = game_loader.game;
        this.render();
    }
    create_map() {
        var model = new Map();
        var view = new MapEditor({
            model: model,
            game: this.game_model
        });

        this.game_model.maps.add(model);

        this.element.querySelector(".content").innerHTML = '';
        this.element.querySelector(".content").appendChild(view.element);

        view.render();
    }
    select_map(event) {
        var id = event.target.dataset.id;
        var map = this.game_model.maps.get(id);
        var view = new MapEditor({
            model: map,
            game: this.game_model
        });

        this.element.querySelector(".content").innerHTML = '';
        this.element.querySelector(".content").appendChild(view.element);

        view.render();
    }
    create_character() {
        var character = new Character();
        var view = new CharacterEditor({
            model: character,
            game: this.game_model
        });
    }
    select_character(event) {
        var id = event.target.dataset.id;
        var character = this.game_model.characters.get(id);
    }
    create_particle_system() {
        //
    }
    select_particle_system(event) {
        var id = event.target.dataset.id;
        var particle_system = this.game_model.particle_systems.get(id);
    }
    create_sprite_sheet() {
        var model = new SpriteSheet();
        var view = new SpriteSheetEditor({
            model: model,
            game: this.game_model
        });

        this.game_model.sprite_sheets.add(model);

        this.element.querySelector(".content").innerHTML = '';
        this.element.querySelector(".content").appendChild(view.element);

        view.render();
    }
    select_sprite_sheet(event) {
        var id = event.target.dataset.id;
        var sprite_sheet = this.game_model.sprite_sheets.get(id);
        console.log(sprite_sheet, this.game_model);
        var view = new SpriteSheetEditor({
            model: sprite_sheet,
            game: this.game_model
        });

        this.element.querySelector('.content').innerHTML = '';
        this.element.querySelector('.content').appendChild(view.element);

        view.render();
    }
    render() {
        if (this.game_model === null) {
            return;
        }

        this.game_model.maps.each(map => {
            var div = document.createElement('div');
            div.classList.add('hx-sidebar-section');
            div.innerHTML = map.name;
            div.classList.add('select_map');
            div.dataset.id = map.id;
            this.element.querySelector('#map_selector').appendChild(div);
        });

        this.game_model.characters.each(character => {
            var div = document.createElement('div');
            div.classList.add('hx-sidebar-section');
            div.innerHTML = character.name;
            div.classList.add('select_character');
            div.dataset.id = character.id;
            this.element.querySelector('#character_selector').appendChild(div);
        });

        this.game_model.particle_systems.each(particle_system => {
            var div = document.createElement('div');
            div.classList.add('hx-sidebar-section');
            div.innerHTML = particle_system.name;
            div.classList.add('select_particle_system');
            div.dataset.id = particle_system.id;
            this.element.querySelector('#particle_system_selector').appendChild(div);
        });

        this.game_model.sprite_sheets.each(sprite_sheet => {
            var div = document.createElement('div');
            div.classList.add('hx-sidebar-section');
            div.innerHTML = sprite_sheet.name;
            div.classList.add('select_sprite_sheet');
            div.dataset.id = sprite_sheet.id;
            this.element.querySelector('#sprite_sheet_selector').appendChild(div);
        });
    }
}

module.exports = App;
