'use strict';

var Model = require('../../lib/model.js');
var Map = require('./map.js');

var Maps = require('./maps.js');
var Entities = require('./entities.js');
var ParticleSystems = require('./particle_systems.js');
var MapInstances = require('./map_instances.js');
var EntityInstances = require('./entity_instances.js');
var ParticleSystemInstances = require('./particle_system_instances.js');

class Game extends Model {
    get defaults() {
        return {
            path: '',
            name: '',
            description: '',
            version: 0,
            maps: null,
            entities: null,
            particle_systems: null,
            map_instances: null,
            entity_instances: null,
            particle_system_instances: null
        };
    }
    constructor(data) {
        super(data);

        console.log("Before: ", this.maps);

        if (this.maps === null) {
            this.maps = [];
        }

        console.log("After: ", this.maps);

        if (this.entities === null) {
            this.entities = [];
        }
        if (this.particle_systems === null) {
            this.particle_systems = [];
        }
        if (this.map_instances === null) {
            this.map_instances = [];
        }
        if (this.entity_instances === null) {
            this.entity_instances = [];
        }
        if (this.particle_system_instances === null) {
            this.particle_system_instances = [];
        }

        this.maps = new Maps(this.maps);
        this.entities = new Entities(this.entities);
        this.particle_systems = new ParticleSystems(this.particle_systems);
        this.map_instances = new MapInstances(this.map_instances);
        this.entity_instances = new EntityInstances(this.entity_instances);
        this.particle_system_instances = new ParticleSystemInstances(this.particle_system_instances);
        console.log("Maps: ", this.maps);
    }
    game_logic() {
        // Override Me
    }
    update(time_delta) {
        var map_instances = this.map_instances;
        var entity_instances = this.entity_instances;
        var particle_system_instances = this.particle_system_instances;

        if (this.map_instances !== undefined) {
            this.map_instances.models.forEach((map_instance) => {
                map_instance.update(time_delta);
            });
        }

        if (this.entity_instances !== undefined) {
            this.entity_instances.models.forEach((entity_instance) => {
                entity_instance.update(time_delta);
            });
        }

        if (this.map_instances !== undefined) {
            this.map_instances.models.forEach((map_instance) => {
                map_instance.update(time_delta);
            });
        }

        this.game_logic();
    }
}

module.exports = Game;
