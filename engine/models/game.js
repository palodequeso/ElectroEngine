'use strict';

var Model = require('../../lib/model.js');
var Map = require('./map.js');

class Game extends Model {
    get defaults() {
        return {
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
    }
    game_logic() {
        // Override Me
    }
    update(time_delta) {
        var map_instances = this.get("map_instances");
        var entity_instances = this.get("entity_instances");
        var particle_system_instances = this.get("particle_system_instances");

        if (this.map_instances !== undefined) {
            this.map_instances.forEach((map_instance) => {
                map_instance.update(time_delta);
            });
        }

        if (this.entity_instances !== undefined) {
            this.entity_instances.forEach((entity_instance) => {
                entity_instance.update(time_delta);
            });
        }

        if (this.map_instances !== undefined) {
            this.map_instances.forEach((map_instance) => {
                map_instance.update(time_delta);
            });
        }

        this.game_logic();
    }
    render() {
        //
    }
}

module.exports = Game;
