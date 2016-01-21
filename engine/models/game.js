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
    update() {
        //
    }
    render() {
        //
    }
}

module.exports = Game;
