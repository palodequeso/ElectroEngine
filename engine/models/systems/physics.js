'use strict';

var System = require('../ecs/system.js');

class Physics extends System {
    get defaults() {
        return {
            name: 'Physics',
            order_index: 0,
            type: '', // 'basic' or 'rigid_body'
            engine: null
        };
    }
    constructor(data) {
        super(data);
        this.entities_added = false;
        // Instantiate default engine if none was passed in.
    }
    update(time_delta, entities) {
        if (this.type === 'rigid_body') {
            if (!this.entities_added) {
                console.log("Entities: ", entities);
                this.engine.add_collision_group_relationship('characters', 'maps');
                entities.each((entity) => {
                    this.engine.add_entity(entity);
                });
                this.entities_added = true;
            }
            if (this.engine) {
                this.engine.update(time_delta, entities);

                var components;
                entities.each((entity) => {
                    components = entity.components.get_by_index('type', 'collision_body');

                    var bodies = [];
                    if (components) {
                        components.forEach((component) => {
                            if (component.body.is_dynamic) {
                                bodies.push(component.body);
                            }
                        });
                    }

                    var position = null;
                    var collision_rect = [0, 0];
                    bodies.forEach((body_data) => {
                        position = body_data.body.position;
                        collision_rect = body_data.collision_rect;
                    });

                    if (position !== null) {
                        components = entity.components.get_by_index('type', 'sprite');
                        if (components) {
                            components.forEach((component) => {
                                component.sprite_instance.position[0] = (
                                    position[0] * this.engine.scale_factor) - (collision_rect[0] / 2.0);
                                component.sprite_instance.position[1] = (
                                    position[1] * this.engine.scale_factor) - (collision_rect[1] / 2.0);
                            });
                        }
                    }
                });
            }
        } else if (this.type === 'basic' && this.engine) {
            this.engine.update(time_delta, entities);
        }
        // update graphics position
    }
}

module.exports = Physics;
