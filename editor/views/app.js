'use strict';

const {dialog} = require('electron').remote;

var fs = require('fs');

var $ = require('jquery');
var Handlebars = require('handlebars');
var View = require('../../lib/view.js');

var game_model = require('../../engine/models/game.js');
var game_views = require('./game.js');
var gameio = require('../../engine/util/gameio.js');

var Map = require('../../engine/models/maps/map.js');
var Maps = require('../../engine/models/maps/maps.js');
var MapEditor = require('./map.js');

var SpriteSheet = require('../../engine/models/graphics/sprite_sheet.js');
var SpriteSheets = require('../../engine/models/graphics/sprite_sheets.js');
var SpriteSheetEditor = require('./sprite_sheet.js');

var util = require('./util.js');

class App extends View {
    constructor(options) {
        super(options);
        this.game_model = null;

        this.$element.on('click', '#edit_game_button', this.edit_game.bind(this));
        this.$element.on('click', '#save_game_button', this.save_game.bind(this));
        this.$element.on('click', '#build_game_button', this.build_game.bind(this));
        this.$element.on('click', '#create_game_button', this.create_game.bind(this));
        this.$element.on('click', '#load_game_button', this.load_game.bind(this));
        this.$element.on('click', '#create_map_button', this.create_map.bind(this));
        this.$element.on('click', '#create_sprite_sheet_button', this.create_sprite_sheet.bind(this));
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
            console.log("Game Model Created and Set");
        });

        this.$element.find(".content").empty();
        this.$element.find(".content").append(gv.$element);
    }
    create_map() {
        console.log("Create Map");
        var model = new Map();
        var view = new MapEditor({
            model: model,
            game: this.game_model
        });

        this.game_model.maps.add(model);

        this.$element.find(".content").empty();
        this.$element.find(".content").append(view.$element);

        view.render();
    }
    create_sprite_sheet() {
        var model = new SpriteSheet();
        var view = new SpriteSheetEditor({
            model: model,
            game: this.game_model
        });

        this.game_model.sprite_sheets.add(model);

        this.$element.find(".content").empty();
        this.$element.find(".content").append(view.$element);

        view.render();
    }
    load_game() {
        var choice = dialog.showOpenDialog({properties: ['openDirectory']});
        console.log("Game Folder: ", choice);
        var game_loader = new gameio.GameLoader(choice[0], game_model);
        // var result = gameio.load(choice[0], game_model);
        this.game_model = game_loader.game;
        this.render();
    }
    render() {
        this.$element.find("#game_edit_buttons").hide();
        this.$element.find("#map_selector").empty();
        this.$element.find("#entity_selector").empty();
        this.$element.find("#particle_system_selector").empty();

        if (this.game_model === null) {
            return;
        }

        this.$element.find("#game_edit_buttons").show();

        if (this.game_model.maps !== null) {
            this.game_model.maps.each((map) => {
                this.$element.find("#map_selector").append('<div class="hx-sidebar-section">' + map.name + '</div>');
            });
        }

        // if (this.game_model.entities !== null) {
        //     this.game_model.entities.each((entity) => {
        //         this.$element.find("#entity_selector").append('<div class="hx-sidebar-section">' + entity.name + '</div>');
        //     });
        // }
        //
        // if (this.game_model.particle_systems !== null) {
        //     this.game_model.particle_systems.models.forEach((particle_system) => {
        //         this.$element.find("#particle_system_selector").append('<div class="hx-sidebar-section">' + particle_system.name + '</div>');
        //     });
        // }
    }
}

module.exports = App;
