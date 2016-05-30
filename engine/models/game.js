'use strict';

var Model = require('../../lib/model.js');
var Map = require('./maps/map.js');

var Maps = require('./maps/maps.js');
var Characters = require('./characters/characters.js');
var SpriteSheets = require('./graphics/sprite_sheets.js');
var ParticleSystems = require('./particle_systems/particle_systems.js');
var MapInstances = require('./maps/map_instances.js');
var CharacterInstances = require('./characters/character_instances.js');
var ParticleSystemInstances = require('./particle_systems/particle_system_instances.js');

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
            sprite_sheets: null,
            particle_systems: null,
            map_instances: null,
            character_instances: null,
            particle_system_instances: null
        };
    }
    constructor(data) {
        super(data);

        if (this.maps === null) {
            this.maps = [];
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
        if (this.map_instances === null) {
            this.map_instances = [];
        }
        if (this.character_instances === null) {
            this.character_instances = [];
        }
        if (this.particle_system_instances === null) {
            this.particle_system_instances = [];
        }

        this.maps = new Maps(this.maps);
        this.characters = new Characters(this.characters);
        this.sprite_sheets = new SpriteSheets(this.sprite_sheets);
        this.particle_systems = new ParticleSystems(this.particle_systems);
        this.map_instances = new MapInstances(this.map_instances);
        this.character_instances = new CharacterInstances(this.character_instances);
        this.particle_system_instances = new ParticleSystemInstances(this.particle_system_instances);
    }
    game_logic() {
        // Override Me
    }
    update(time_delta) {
        var map_instances = this.map_instances;
        var character_instances = this.character_instances;
        var particle_system_instances = this.particle_system_instances;

        if (this.map_instances !== undefined) {
            this.map_instances.each((map_instance) => {
                map_instance.update(time_delta);
            });
        }

        // No longer needed
        if (this.character_instances !== undefined) {
            this.character_instances.each((character_instance) => {
                character_instances.update(time_delta);
            });
        }

        // Should be moved to map instances eventually.
        if (this.particle_system_instances !== undefined) {
            this.particle_system_instances.each((particle_system_instance) => {
                particle_system_instance.update(time_delta);
            });
        }

        this.game_logic();

        input.update();
    }
}

module.exports = Game;
