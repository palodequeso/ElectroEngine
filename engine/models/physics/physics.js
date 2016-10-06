'use strict';

var Model = require('exo').Model;

class Physics extends Model {
    get defaults() {
        return {
            scale_factor: 10.0,
            collision_groups: {}
        };
    }
    constructor(data) {
        super(data);
    }
    add_collision_group_relationship(collision_group_a, collision_group_b) {
        if (!this.collision_groups.hasOwnProperty(collision_group_a)) {
            this.collision_groups[collision_group_a] = [];
        }
        if (!this.collision_groups.hasOwnProperty(collision_group_b)) {
            this.collision_groups[collision_group_b] = [];
        }
        this.collision_groups[collision_group_a].push(collision_group_b);
        this.collision_groups[collision_group_b].push(collision_group_a);
    }
    add_entity(entity) {
        // Override
    }
    update(time_delta, entities) {
        // Override
    }
}

module.exports = Physics;

// TODO: Add simple top down collision detection as well without Box2d
// class Physics extends Model {
//     get defaults() {
//         return {
//             world: null,
//             up_vec: null,
//             vector: null,
//             contact_listener: null,
//             contact_filter: null,
//             entity_instances: null,
//             gravity: [0.0, 0.0],
//             scale_factor: 100.0,
//             collision_groups: {}
//         };
//     }
//     constructor(data) {
//         super(data);
//
//         this.world = new Box2D.Dynamics.b2World(
//             new Box2D.Common.Math.b2Vec2(this.gravity[0], this.gravity[1]),
//             true);
//         this.up_vec = new Box2D.Common.Math.b2Vec2(0, 5);
//         this.vector = new Box2D.Common.Math.b2Vec2(0, 0);
//         this.contact_listener = new Box2D.Dynamics.b2ContactListener;
//         this.contact_listener.BeginContact = this.begin_contact.bind(this);
//         this.contact_listener.EndContact = this.end_contact.bind(this);
//         this.contact_listener.PostSolve = this.post_solve.bind(this);
//         this.contact_listener.PreSolve = this.pre_solve.bind(this);
//         this.world.SetContactListener(this.contact_listener);
//         this.contact_filter = new Box2D.Dynamics.b2ContactFilter;
//         this.contact_filter.RayCollide = this.ray_collide.bind(this);
//         this.contact_filter.ShouldCollide = this.should_collide.bind(this);
//         this.world.SetContactFilter(this.contact_filter);
//     }
//     add_collision_group_relationship(collision_group_a, collision_group_b) {
//         if (!this.collision_groups.hasOwnProperty(collision_group_a)) {
//             this.collision_groups[collision_group_a] = [];
//         }
//         if (!this.collision_groups.hasOwnProperty(collision_group_b)) {
//             this.collision_groups[collision_group_b] = [];
//         }
//         this.collision_groups[collision_group_a].push(collision_group_b);
//         this.collision_groups[collision_group_b].push(collision_group_a);
//         console.log(this.collision_groups);
//     }
//     add_entity(entity) {
//         var components = entity.components.get_by_index('type', 'collision_body');
//         var bodies = [];
//         if (components) {
//             components.forEach((component) => {
//                 bodies.push(component.body);
//             });
//         }
//
//         bodies.forEach((body_data) => {
//             var collision_rect = body_data.collision_rect;
//             var dynamic = body_data.is_dynamic;
//             var bullet = body_data.is_bullet;
//             var position = body_data.position;
//
//             var body_definition = new Box2D.Dynamics.b2BodyDef;
//             if (body_data.is_dynamic) {
//                 body_definition.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
//                 if (body_data.is_bullet) {
//                     body_definition.bullet = true;
//                 }
//             } else {
//                 body_definition.type = Box2D.Dynamics.b2Body.b2_staticBody;
//             }
//             body_definition.position.x = (position[0] + collision_rect[0] + (collision_rect[2] / 2.0)) / this.scale_factor;
//             body_definition.position.y = (position[1] + collision_rect[1] + (collision_rect[3] / 2.0)) / this.scale_factor;
//             var body = this.world.CreateBody(body_definition);
//             body.SetUserData(body_data);
//             body_data.body = body;
//             console.log(body.GetPosition());
//
//             var new_local = new Box2D.Common.Math.b2Vec2(body_data.position[0], body_data.position[1]);
//             body_data.shapes.forEach((shape) => {
//                 var fixture_definition = new Box2D.Dynamics.b2FixtureDef;
//                 fixture_definition.friction = shape.friction;
//                 fixture_definition.restitution = shape.restitution;
//                 fixture_definition.density = shape.density;
//                 if (shape.type === 'box') {
//                     fixture_definition.shape = new Box2D.Collision.Shapes.b2PolygonShape;
//                     // TODO: Use top left and bottom right!
//                     fixture_definition.shape.SetAsBox(
//                         (collision_rect[2]) / (2.0 * this.scale_factor),
//                         (collision_rect[3]) / (2.0 * this.scale_factor)
//                     );
//                     // fixture_definition.shape.SetLocalPosition(new_local);
//                 } else if (shape.type === 'circle') {
//                     fixture_definition.shape = new Box2D.Collision.Shapes.b2CircleShape(5.0 / this.scale_factor);
//                     fixture_definition.shape.SetLocalPosition(new_local);
//                 } else if (shape.type === 'edge') {
//                     fixture_definition.shape = new Box2D.Collision.Shapes.b2PolygonShape;
//                     var begin = new Box2D.Common.Math.b2Vec2(shape.begin[0] / this.scale_factor, shape.begin[1] / this.scale_factor);
//                     var end = new Box2D.Common.Math.b2Vec2(shape.end[0] / this.scale_factor, shape.end[1] / this.scale_factor);
//                     fixture_definition.shape.SetAsEdge(begin, end);
//                 } else if (shape.polygon === 'polygon') {
//                     fixture_definition.shape = new Box2D.Collision.Shapes.b2PolygonShape;
//                     var vertices = [];
//                     shape.vertices.forEach((vertex) => {
//                         var b_vertex = new Box2D.Common.Math.b2Vec2(vertex[0] / this.scale_factor, vertex[1] / this.scale_factor);
//                         vertices.push(b_vertex);
//                     });
//                     fixture_definition.shape.SetAsArray(vertices, shape.vertices.length);
//                 }
//                 body.CreateFixture(fixture_definition);
//             });
//         });
//     }
//     destroy_body(entity) {
//         var components = entity.components.get_by_index('type', 'collision_body');
//         var bodies = [];
//         if (components) {
//             components.forEach((component) => {
//                 bodies.push(component.body);
//             });
//         }
//
//         bodies.forEach((body_data) => {
//             var body = body_data.physics_engine_body;
//             if (body !== undefined) {
//                 this.world.DestroyBody(body);
//                 body_data.physics_engine_body = null;
//                 // TODO: Remove component as well!
//             }
//         });
//     }
//     begin_contact(contact) {
//         var body_a = contact.GetFixtureA().GetBody();
//         var body_b = contact.GetFixtureB().GetBody();
//         var user_body_a = body_a.GetUserData();
//         var user_body_b = body_b.GetUserData();
//         //console.log(sprite_instance);
//         // if (!_.isNull(user_body_a)) {
//             // if (user_body_a.get("bullet")) {
//                 // user_body_a.set({alive: false});
//                 //this.get("sprite_instances").remove(sprite_instance);
//                 //this.world.DestroyBody(body);
//                 //console.log("Destroying Body!");
//             // }
//         // }
//     }
//     end_contact(contact) {
//         var body = contact.GetFixtureA().GetBody();
//         var user_body = body.GetUserData();
//     }
//     post_solve(contact, impulse) {
//         var body = contact.GetFixtureA().GetBody();
//         var user_body = body.GetUserData();
//     }
//     pre_solve(contact, old_manifold) {
//         var body = contact.GetFixtureA().GetBody();
//         var user_body = body.GetUserData();
//     }
//     ray_collide(user_data, fixture) {
//         //
//     }
//     should_collide(fixture_a, fixture_b) {
//         var body_a = fixture_a.GetBody();
//         var body_b = fixture_b.GetBody();
//         var user_body_a = body_a.GetUserData();
//         var user_body_b = body_b.GetUserData();
//
//         var includes_bullet = false;
//         var includes_character = false;
//         if (user_body_a !== null && user_body_b !== null && this.collision_groups.hasOwnProperty(user_body_a.collision_group)) {
//             return (this.collision_groups[user_body_a.collision_group].
//                     indexOf(user_body_b.collision_group) !== -1);
//         }
//     }
//     move(entity, velocity) {
//         var body = entity_instance.body;
//         var position = body.GetPosition();
//         position.x += velocity[0] / this.scale_factor;
//         position.y += velocity[1] / this.scale_factor;
//         body.SetPosition(position);
//         body.SetAwake(true);
//     }
//     apply_impulse(entity_instance, impulse, max_velocity) {
//         var body = entity_instance.body;
//         var position = body.GetPosition();
//         this.vector.x = impulse[0];
//         this.vector.y = impulse[1];
//         if (max_velocity !== undefined) {
//             var velocity = body.GetLinearVelocity();
//             if (Math.abs(velocity.x) > max_velocity[0]) {
//                 return
//             }
//             if (Math.abs(velocity.y) > max_velocity[1]) {
//                 return
//             }
//             body.ApplyImpulse(this.vector, position);
//             return;
//         }
//         body.ApplyImpulse(this.vector, position);
//     }
//     set_linear_velocity(sprite_instance, velocity) {
//         var body = sprite_instance.get("body");
//         this.vector.x = velocity[0];
//         this.vector.y = velocity[1];
//         body.SetLinearVelocity(this.vector);
//     }
//     update(frame_time, entities) {
//         this.world.Step(frame_time, 8, 3);
//         this.world.ClearForces();
//
//         entities.each((entity) => {
//             var components = entity.components.get_by_index('type', 'collision_body');
//             var bodies = [];
//             if (components) {
//                 components.forEach((component) => {
//                     bodies.push(component.body);
//                 });
//             }
//
//             bodies.forEach((body_data) => {
//                 if (body_data.is_dynamic) {
//                     var physics_body = body_data.body;
//                     var position = physics_body.GetPosition();
//                     var position = physics_body.GetWorldCenter();
//                     var new_x = (position.x - 0.32) * this.scale_factor;
//                     var new_y = (position.y - 0.32) * this.scale_factor;
//                     body_data.position = [new_x, new_y];
//                     console.log(physics_body, body_data.position, position, this.scale_factor);
//                 }
//             });
//         });
//     }
//     // render(context) {
//     //     if (this.debug_drawing_enabled) {
//     //         this.debug_draw.SetSprite(context);
//     //         this.world.DrawDebugData();
//     //     }
//     // }
// }
//
// module.exports = Physics;
