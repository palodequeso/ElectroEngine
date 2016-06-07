'use strict';

var Model = require('../../lib/model.js');

var Entities = require('../ecs/entities.js');
var Systems = requirE('../ecs/systems.js');

var Map = require('./maps/map.js');
var Maps = require('./maps/maps.js');
var Characters = require('./characters/characters.js');
var Sprites = require('./graphics/sprites.js');
var SpriteSheets = require('./graphics/sprite_sheets.js');
var ParticleSystems = require('./particle_systems/particle_systems.js');

var input = require('./input.js');

class Game extends Model {
    get defaults() {
        return {
            path: '',
            name: '',
            description: '',
            version: 0,
            maps: null,
            characters: null,
            sprites: null,
            sprite_sheets: null,
            particle_systems: null,
            entities: null,
            systems: null
        };
    }
    constructor(data) {
        super(data);

        if (this.maps === null) {
            this.maps = [];
        }
        if (this.sprites === null) {
            this.sprites = [];
        }
        if (this.characters === null) {
            this.characters = [];
        }
        if (this.sprite_sheets === null) {
            this.sprite_sheets = [];
        }
        if (this.particle_systems === null) {
            this.particle_systems = [];
        }
        if (this.entities === null) {
            this.entities = [];
        }
        if (this.systems === null) {
            this.systems = [];
        }

        this.maps = new Maps(this.maps);
        this.sprites = new Sprites(this.sprites);
        this.characters = new Characters(this.characters);
        this.sprite_sheets = new SpriteSheets(this.sprite_sheets);
        this.particle_systems = new ParticleSystems(this.particle_systems);
        this.entities = new Entities(this.entities);
        this.systems = new Systems(this.systems);
        this.systems.sort();
    }
    update(time_delta) {
        this.systems.each((system) => {
            system.update(time_delta, this.entities);
        });
        input.update();
    }
}

module.exports = Game;
