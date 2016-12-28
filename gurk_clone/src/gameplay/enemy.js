'use strict';

const Model = require('exo').Model;

var Entity = require('../../../engine/models/ecs/entity.js');

class Enemy extends Model {
    get defaults() {
        return {
            character_entity: null
        };
    }
    get types() {
        return {
            character_entity: Entity
        };
    }
}

module.exports = Enemy;
