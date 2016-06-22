// var Matter = require('matter-js');
var p2 = require('p2');
var Physics = require('./physics.js');

class RigidBodyPhysics extends Physics {
    get defaults() {
        var defaults = super.defaults;
        defaults.world = null;
        defaults.gravity = [0.0, 10.0];
        return defaults;
    }
    constructor(data) {
        super(data);

        this.world = new p2.World({
            gravity: this.gravity
        });
    }
    add_entity(entity) {
        var components = entity.components.get_by_index('type', 'collision_body');
        var bodies = [];
        if (components) {
            components.forEach((component) => {
                bodies.push(component.body);
            });
        }

        bodies.forEach((body_data) => {
            var collision_rect = body_data.collision_rect;
            var dynamic = body_data.is_dynamic;
            var bullet = body_data.is_bullet;
            var position = body_data.position;

            var body = new p2.Body({
                mass: (dynamic) ? body_data.mass : 0.0,
                position: [position[0] / this.scale_factor,
                           position[1] / this.scale_factor],
                angularVelocity: 0.0
            });
            body.user_data = body_data;
            body_data.body = body;

            body_data.shapes.forEach((shape) => {
                if (shape.type === 'box') {
                    var top_left = shape.top_left;
                    var bottom_right = shape.bottom_right;
                    var box_shape = new p2.Box({
                        width: (bottom_right[0] - top_left[0]) / this.scale_factor,
                        height: (top_left[1] - bottom_right[1]) / this.scale_factor
                    });
                    body.addShape(box_shape, shape.offset, shape.angle);
                } else if (shape.type === 'circle') {
                    var circle_shape = new p2.Circle({
                        radius: shape.radius / this.scale_factor
                    });
                    body.addShape(circle_shape, shape.offset, shape.angle);
                } else if (shape.type === 'edge') {
                    var x1 = shape.start[0];
                    var x2 = shape.end[0];
                    var y1 = shape.start[1];
                    var y2 = shape.end[1];
                    var line_shape = new p2.Line({
                        length: length
                    });
                    body.addShape(line_shape, shape.offset, shape.angle);
                } else if (shape.polygon === 'polygon') {
                    // TODO
                }
            });

            this.world.addBody(body);
        });
    }
    update(time_delta, entities) {
        this.world.step(1 / 60.0, time_delta, 10);

        entities.each((entity) => {
            var components = entity.components.get_by_index('type', 'collision_body');

            var bodies = [];
            if (components) {
                components.forEach((component) => {
                    if (component.body.is_dynamic) {
                        bodies.push(component.body);
                    }
                });
            }

            var position = null;
            bodies.forEach((body_data) => {
                position = body_data.body.position;
            });

            if (position !== null) {
                var components = entity.components.get_by_index('type', 'sprite');
                if (components) {
                    components.forEach((component) => {
                        component.sprite_instance.position = position;
                    });
                }
            }
        });
    }
}

module.exports = RigidBodyPhysics;
