var box2d = require('Box2dWeb');

var Model = require('../../../lib/model.js');

// TODO: Add simple top down collision detection as well without Box2d
class Physics extends Model {
    get defaults() {
        return {
            world: null,
            up_vec: null,
            vector: null,
            contact_listener: null,
            contact_filter: null,
            entity_instances: null,
            gravity: [0.0, 0.0],
            scale_factor: 100.0,
            collision_groups: {}
        };
    }
    constructor(data) {
        super(data);

        // this.debug_drawing_enabled = false;
        // this.debug_draw = null;
        this.world = new box2d.Dynamics.b2World(
            new box2d.Common.Math.b2Vec2(this.gravity[0], this.gravity[1]),
            true);
        this.up_vec = new box2d.Common.Math.b2Vec2(0, 5);
        this.vector = new box2d.Common.Math.b2Vec2(0, 0);
        this.contact_listener = new box2d.Dynamics.b2ContactListener;
        this.contact_listener.BeginContact = this.begin_contact;
        this.contact_listener.EndContact = this.end_contact;
        this.contact_listener.PostSolve = this.post_solve;
        this.contact_listener.PreSolve = this.pre_solve;
        this.world.SetContactListener(this.contact_listener);
        this.contact_filter = new box2d.Dynamics.b2ContactFilter;
        this.contact_filter.RayCollide = this.ray_collide;
        this.contact_filter.ShouldCollide = this.should_collide;
        this.world.SetContactFilter(this.contact_filter);
        // this.listenTo(this.get("sprite_instances"), "add", this.add_sprite);
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
    setup_debug_draw(context) {
        // this.debug_drawing_enabled = true;
        // this.debug_draw = new box2d.Dynamics.b2DebugDraw();
        // this.debug_draw.SetSprite(context);
        // this.debug_draw.SetDrawScale(this.scale_factor);
        // this.debug_draw.SetFillAlpha(0.5);
        // this.debug_draw.SetLineThickness(1.0);
        // this.debug_draw.SetFlags(box2d.Dynamics.b2DebugDraw.e_shapeBit |
        //                         box2d.Dynamics.b2DebugDraw.e_jointBit);
        // this.world.SetDebugDraw(this.debug_draw);
    }
    set_map(map_id) {
        // var map = this.get("maps").get(map_id);
        // var geometry = map.get("geometry");
        // _.each(geometry, function(shape) {
        //     var fixture_definition = new box2d.Dynamics.b2FixtureDef;
        //     fixture_definition.friction = 0.5;
        //     fixture_definition.restitution = 0.2;
        //     fixture_definition.density = 1.0;
        //     var body_definition = new box2d.Dynamics.b2BodyDef;
        //     body_definition.type = box2d.Dynamics.b2Body.b2_staticBody;
        //     fixture_definition.shape = new box2d.Collision.Shapes.b2PolygonShape;
        //
        //     if (shape.type === "polygon") {
        //         var vertices = [];
        //         _.each(shape.vertices, function(vertex) {
        //             var b_vertex = new box2d.Common.Math.b2Vec2(vertex[0] / this.scale_factor,
        //                                                         vertex[1] / this.scale_factor);
        //             vertices.push(b_vertex);
        //         }, this);
        //         console.log(vertices, shape.vertices.length);
        //         fixture_definition.shape.SetAsArray(vertices,
        //                                             shape.vertices.length);
        //         var body = this.world.CreateBody(body_definition);
        //         var fixture = body.CreateFixture(fixture_definition);
        //     } else if (shape.type === "edge") {
        //         var begin = new box2d.Common.Math.b2Vec2(
        //             shape.begin[0] / this.scale_factor, shape.begin[1] / this.scale_factor);
        //         var end = new box2d.Common.Math.b2Vec2(
        //             shape.end[0] / this.scale_factor, shape.end[1] / this.scale_factor);
        //         fixture_definition.shape.SetAsEdge(begin, end);
        //         var body = this.world.CreateBody(body_definition);
        //         var fixture = body.CreateFixture(fixture_definition);
        //     }
        // }, this);
        // console.log("Geometry of Map Loaded");
    },
    add_entity_instance(entity_instance) {
        var sprite_instance = entity_instance.sprite_instance;
        var entity = entity_instance.entity;
        var collides = entity.collides;
        if (!collides) {
            return;
        }

        var collision_rect = entity.collision_rect;
        var dynamic = entity.dynamic;
        // var bullet = entity.get("bullet");
        var position = sprite_instance.position;

        var body_definition = new box2d.Dynamics.b2BodyDef;
        if (dynamic) {
            body_definition.type = box2d.Dynamics.b2Body.b2_dynamicBody;
            // if (bullet) {
            //     body_definition.bullet = true;
            // }
        } else {
            body_definition.type = box2d.Dynamics.b2Body.b2_staticBody;
        }
        body_definition.position.x = (position[0] + collision_rect[0] + (collision_rect[2] / 2.0)) / this.scale_factor;
        body_definition.position.y = (position[1] + collision_rect[1] + (collision_rect[3] / 2.0)) / this.scale_factor;
        var body = this.world.CreateBody(body_definition);
        body.SetUserData(entity_instance);
        entity_instance.body = body
        entity_instance.has_body = true;

        if (dynamic) {
            // if (bullet) {
            //     var fixture_definition = new box2d.Dynamics.b2FixtureDef;
            //     fixture_definition.friction = 0.5;
            //     fixture_definition.restitution = 0.2;
            //     fixture_definition.density = 0.0;
            //     fixture_definition.shape = new box2d.Collision.Shapes.b2PolygonShape;
            //     fixture_definition.shape.SetAsBox(
            //         (collision_rect[2]) / (2.0 * this.scale_factor),
            //         (collision_rect[3]) / (2.0 * this.scale_factor)
            //     );
            //     body.CreateFixture(fixture_definition);
            // } else {
                var fixture_definition = new box2d.Dynamics.b2FixtureDef;
                fixture_definition.friction = 0.5;
                fixture_definition.restitution = 0.2;
                fixture_definition.density = 0.0;
                fixture_definition.shape = new box2d.Collision.Shapes.b2PolygonShape;
                fixture_definition.shape.SetAsBox(
                    (collision_rect[2] - 5) / (2.0 * this.scale_factor),
                    (collision_rect[3] - 5) / (2.0 * this.scale_factor)
                );
                body.CreateFixture(fixture_definition);
                var left_shere = new box2d.Dynamics.b2FixtureDef;
                left_shere.friction = 0.8;
                left_shere.restitution = 0.0;
                left_shere.density = 0.0;
                left_shere.shape = new box2d.Collision.Shapes.b2CircleShape(5.0 / this.scale_factor);
                var new_local = new box2d.Common.Math.b2Vec2(
                    -(collision_rect[2] - 10) / (2.0 * this.scale_factor),
                    -(collision_rect[3] - 5) / (2.0 * this.scale_factor)
                );
                left_shere.shape.SetLocalPosition(new_local);
                body.CreateFixture(left_shere);
                var right_shere = new box2d.Dynamics.b2FixtureDef;
                right_shere.friction = 0.8;
                right_shere.restitution = 0.0;
                right_shere.density = 0.0;
                right_shere.shape = new box2d.Collision.Shapes.b2CircleShape(5.0 / this.scale_factor);
                var new_local = new box2d.Common.Math.b2Vec2(
                    (collision_rect[2] - 10) / (2.0 * this.scale_factor),
                    -(collision_rect[3] - 5) / (2.0 * this.scale_factor)
                );
                right_shere.shape.SetLocalPosition(new_local);
                body.CreateFixture(right_shere);
            // }
        } else {
            var fixture_definition = new box2d.Dynamics.b2FixtureDef;
            fixture_definition.friction = 0.5;
            fixture_definition.restitution = 0.2;
            fixture_definition.density = 1.0;
            fixture_definition.shape = new box2d.Collision.Shapes.b2PolygonShape;
            fixture_definition.shape.SetAsBox(
                collision_rect[2] / (2.0 * this.scale_factor),
                collision_rect[3] / (2.0 * this.scale_factor));
            body.CreateFixture(fixture_definition);
        }
        console.log("Sprite Added");
    }
    destroy_body(entity_instance) {
        var body = entity_instance.body;
        if (body !== undefined) {
            this.world.DestroyBody(body);
            entity_instance.body = null;
        }
    }
    begin_contact(contact) {
        var body = contact.GetFixtureA().GetBody();
        var body_b = contact.GetFixtureB().GetBody();
        var sprite_instance = body.GetUserData();
        var sprite_instance_b = body_b.GetUserData();
        //console.log(sprite_instance);
        if (!_.isNull(sprite_instance)) {
            if (sprite_instance.get("bullet")) {
                sprite_instance.set({alive: false});
                //this.get("sprite_instances").remove(sprite_instance);
                //this.world.DestroyBody(body);
                //console.log("Destroying Body!");
            }
        }
    }
    end_contact(contact) {
        var body = contact.GetFixtureA().GetBody();
        var entity_instance = body.GetUserData();
    }
    post_solve(contact, impulse) {
        var body = contact.GetFixtureA().GetBody();
        var entity_instance = body.GetUserData();
    }
    pre_solve(contact, old_manifold) {
        var body = contact.GetFixtureA().GetBody();
        var entity_instance = body.GetUserData();
    }
    ray_collide(user_data, fixture) {
        //
    }
    should_collide(fixture_a, fixture_b) {
        var body_a = fixture_a.GetBody();
        var body_b = fixture_b.GetBody();
        var entity_instance_a = body_a.GetUserData();
        var entity_instance_b = body_b.GetUserData();

        var includes_bullet = false;
        var includes_character = false;
        if (entity_instance_a !== null && entity_instance_b !== null) {
            return (this.collision_groups[entity_instance_a.collision_group].
                    indexOf(entity_instance_b.collision_group) !== -1);
        }
    }
    move(entity_instance, velocity) {
        var body = entity_instance.body;
        var position = body.GetPosition();
        position.x += velocity[0] / this.scale_factor;
        position.y += velocity[1] / this.scale_factor;
        body.SetPosition(position);
        body.SetAwake(true);
    }
    apply_impulse(entity_instance, impulse, max_velocity) {
        var body = entity_instance.body;
        var position = body.GetPosition();
        this.vector.x = impulse[0];
        this.vector.y = impulse[1];
        if (max_velocity !== undefined) {
            var velocity = body.GetLinearVelocity();
            if (Math.abs(velocity.x) > max_velocity[0]) {
                return
            }
            if (Math.abs(velocity.y) > max_velocity[1]) {
                return
            }
            body.ApplyImpulse(this.vector, position);
            return;
        }
        body.ApplyImpulse(this.vector, position);
    }
    set_linear_velocity(sprite_instance, velocity) {
        var body = sprite_instance.get("body");
        this.vector.x = velocity[0];
        this.vector.y = velocity[1];
        body.SetLinearVelocity(this.vector);
    }
    update(frame_time) {
        this.world.Step(frame_time, 8, 3);
        this.world.ClearForces();

        var body_sprites = this.get("sprite_instances").where({
            dynamic: true,
            has_body: true
        });

        _.each(body_sprites, function(body_sprite) {
            var body = body_sprite.get("body");
            var pos = body.GetPosition();
            var new_x = (pos.x - 0.32) * this.scale_factor;
            var new_y = (pos.y - 0.32) * this.scale_factor;
            body_sprite.set({position: [new_x, new_y]});
        }, this);
    }
    // render(context) {
    //     if (this.debug_drawing_enabled) {
    //         this.debug_draw.SetSprite(context);
    //         this.world.DrawDebugData();
    //     }
    // }
});

module.exports = Physics;
