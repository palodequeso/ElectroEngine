'use strict';

var Map = require('./map.js');

class Game {
    constructor() {
        this.id = null;
        this.name = '';
        this.version = 0;
        this.maps = null;
        this.entities = null;
        this.particle_systems = null;
        this.map_instances = null;
        this.entity_instances = null;
        this.particle_system_instances = null;
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
