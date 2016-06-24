var p2 = require('p2');
var Physics = require('./physics.js');

class RigidBodyPhysics extends Physics {
    get defaults() {
        var defaults = super.defaults;
        defaults.world = null;
        defaults.gravity = [0.0, 0.0];
        return defaults;
    }
    constructor(data) {
        super(data);

        this.world = new p2.World({
            gravity: this.gravity
        });
        this.world.defaultContactMaterial.friction = 0.0;
    }
    create_shape(shape) {
        if (shape.type === 'box') {
            var top_left = shape.top_left;
            var bottom_right = shape.bottom_right;
            console.log(top_left, bottom_right);
            var box_shape = new p2.Box({
                width: (bottom_right[0] - top_left[0]) / this.scale_factor,
                height: (top_left[1] - bottom_right[1]) / this.scale_factor
            });
            return box_shape;
        } else if (shape.type === 'circle') {
            var circle_shape = new p2.Circle({
                radius: shape.radius / this.scale_factor
            });
            return circle_shape;
        } else if (shape.type === 'edge') {
            var line_shape = new p2.Line({
                length: shape.length / this.scale_factor
            });
            return line_shape;
        } else if (shape.type === 'polygon') {
            // TODO
        } else if (shape.type === 'plane') {
            var plane_shape = new p2.Plane();
            return plane_shape;
        }
        return null;
    }
    create_body(body_data) {
        var position = body_data.position;

        var body = new p2.Body({
            mass: (body_data.is_dynamic) ? body_data.mass : 0.0,
            position: [position[0] / this.scale_factor,
                       position[1] / this.scale_factor],
            angularVelocity: 0.0,
            fixedRotation: body_data.fixed_rotation
        });
        body.user_data = body_data;
        body_data.body = body;

        body_data.shapes.forEach((shape_data) => {
            var shape = this.create_shape(shape_data);
            var offset = [
                shape_data.offset[0] / this.scale_factor,
                shape_data.offset[1] / this.scale_factor
            ]
            body.addShape(shape, offset, shape_data.angle);
        });

        return body;
    }
    add_body(body) {
        this.world.addBody(body);
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
            var body = this.create_body(body_data);
            this.add_body(body);
        });
    }
    update(time_delta, entities) {
        this.world.step(1 / 60.0, time_delta, 10);
    }
}

module.exports = RigidBodyPhysics;
