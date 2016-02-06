'use strict';

var remote = require('remote');
var dialog = remote.require('dialog');

var fs = require('fs');

var $ = require('jquery');
var Handlebars = require('handlebars');
var View = require('../../lib/view.js');

var game_model = require('../../engine/models/game.js');
var game_views = require('./game.js');
var gameio = require('../gameio.js');

var Map = require('../../engine/models/map.js');
var Maps = require('../../engine/models/maps.js');
var MapEditor = require('./map.js');

class App extends View {
    constructor(options) {
        super(options);
        this.game_model = null;

        this.$element.on('click', '#create_game_button', this.create_game.bind(this));
        this.$element.on('click', '#load_game_button', this.load_game.bind(this));
        this.$element.on('click', '#create_map_button', this.create_map.bind(this));
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

        this.$element.find(".content").empty();
        this.$element.find(".content").append(view.$element);

        view.render();
    }
    load_game() {
        var choice = dialog.showOpenDialog({properties: ['openDirectory']});
        console.log("Game Folder: ", choice);
        var result = gameio.load(choice);
        if (result === null) {
            console.error("Oopsies!");
        } else {
            this.game_model = result;
            this.render();
        }
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
            this.game_model.maps.models.forEach((map) => {
                this.$element.find("#map_selector").append('<div class="hx-sidebar-section">' + map.name + '</div>');
            });
        }

        if (this.game_model.entities !== null) {
            this.game_model.entities.models.forEach((entity) => {
                this.$element.find("#entity_selector").append('<div class="hx-sidebar-section">' + entity.name + '</div>');
            });
        }

        if (this.game_model.particle_systems !== null) {
            this.game_model.particle_systems.models.forEach((particle_system) => {
                this.$element.find("#particle_system_selector").append('<div class="hx-sidebar-section">' + particle_system.name + '</div>');
            });
        }
    }
}

module.exports = App;
