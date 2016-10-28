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

class App extends View {
    get events() {
        return {
            'click #edit_game_button': this.edit_game.bind(this),
            'click #save_game_button': this.save_game.bind(this),
            'click #build_game_button': this.build_game.bind(this),
            'click #create_game_button': this.create_game.bind(this),
            'click #load_game_button': this.load_game.bind(this),
            'click #create_map_button': this.create_map.bind(this),
            'click #create_sprite_sheet_button': this.create_sprite_sheet.bind(this)
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
    load_game() {
        var choice = dialog.showOpenDialog({properties: ['openDirectory']});
        console.log("Game Folder: ", choice);
        var game_loader = new gameio.GameLoader(choice[0], game_model);
        // var result = gameio.load(choice[0], game_model);
        this.game_model = game_loader.game;
        this.render();
    }
    render() {
        console.log(this.element, this.element.querySelector);
        this.element.querySelector("#game_edit_buttons").style.display = 'none';
        this.element.querySelector("#map_selector").style.display = 'none';
        this.element.querySelector("#entity_selector").style.display = 'none';
        this.element.querySelector("#particle_system_selector").style.display = 'none';

        if (this.game_model === null) {
            return;
        }

        this.element.querySelector("#game_edit_buttons").style.display = 'block';

        if (this.game_model.maps !== null) {
            this.game_model.maps.each((map) => {
                this.element.querySelector("#map_selector").innerHTML +=
                    `<div class="hx-sidebar-section">${map.name}</div>`;
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
