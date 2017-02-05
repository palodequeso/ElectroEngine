'use strict';

module.exports = {
    models: {
        characters: {
            CharacterInstance: require('./engine/models/characters/character_instance.js'),
            CharacterInstances: require('./engine/models/characters/character_instances.js'),
            Character: require('./engine/models/characters/character.js'),
            Characters: require('./engine/models/characters/characters.js')
        },
        components: {
            Character: require('./engine/models/components/character.js'),
            CollisionBody: require('./engine/models/components/collision_body.js'),
            Map: require('./engine/models/components/map.js'),
            ParticleSystem: require('./engine/models/components/particle_system.js'),
            Sprite: require('./engine/models/components/sprite.js')
        },
        ecs: {
            Component: require('./engine/models/ecs/component.js'),
            Components: require('./engine/models/ecs/components.js'),
            Entities: require('./engine/models/ecs/entities.js'),
            Entity: require('./engine/models/ecs/entity.js'),
            System: require('./engine/models/ecs/system.js'),
            Systems: require('./engine/models/ecs/systems.js')
        },
        graphics: {
            Camera: require('./engine/models/graphics/camera.js'),
            Cameras: require('./engine/models/graphics/cameras.js'),
            SpriteInstance: require('./engine/models/graphics/sprite_instance.js'),
            SpriteInstances: require('./engine/models/graphics/sprite_instances.js'),
            SpriteSheet: require('./engine/models/graphics/sprite_sheet.js'),
            SpriteSheets: require('./engine/models/graphics/sprite_sheets.js'),
            Sprite: require('./engine/models/graphics/sprite.js'),
            Sprites: require('./engine/models/graphics/sprites.js')
        },
        maps: {
            CollisionLayer: require('./engine/models/maps/collision_layer.js'),
            MapInstance: require('./engine/models/maps/map_instance.js'),
            MapInstances: require('./engine/models/maps/map_instances.js'),
            MapLayer: require('./engine/models/maps/map_layer.js'),
            MapLayers: require('./engine/models/maps/map_layers.js'),
            MapTileInstance: require('./engine/models/maps/map_tile_instance.js'),
            MapTileInstances: require('./engine/models/maps/map_tile_instances.js'),
            MapTile: require('./engine/models/maps/map_tile.js'),
            MapTiles: require('./engine/models/maps/map_tiles.js'),
            MapWarp: require('./engine/models/maps/map_warp.js'),
            MapWarps: require('./engine/models/maps/map_warps.js'),
            Map: require('./engine/models/maps/map.js'),
            Maps: require('./engine/models/maps/maps.js')
        },
        particle_systems: {
            ParticleSystemInstance: require('./engine/models/particle_systems/particle_system_instance.js'),
            ParticleSystemInstances: require('./engine/models/particle_systems/particle_system_instances.js'),
            ParticleSystem: require('./engine/models/particle_systems/particle_system.js'),
            ParticleSystems: require('./engine/models/particle_systems/particle_systems.js'),
            Particle: require('./engine/models/particle_systems/particle.js'),
            Particles: require('./engine/models/particle_systems/particles.js')
        },
        physics: {
            BasicPhysics: require('./engine/models/physics/basic_physics.js'),
            Bodies: require('./engine/models/physics/bodies.js'),
            Body: require('./engine/models/physics/body.js'),
            Physics: require('./engine/models/physics/physics.js'),
            RigidBodyPhysics: require('./engine/models/physics/rigid_body_physics.js'),
            ShapeBox: require('./engine/models/physics/shape_box.js'),
            ShapeCircle: require('./engine/models/physics/shape_circle.js'),
            ShapeEdge: require('./engine/models/physics/shape_edge.js'),
            ShapePolygon: require('./engine/models/physics/shape_polygon.js'),
            Shape: require('./engine/models/physics/shape.js')
        },
        systems: {
            Audio: require('./engine/models/systems/audio.js'),
            Gameplay: require('./engine/models/systems/gameplay.js'),
            Graphics: require('./engine/models/systems/graphics.js'),
            Map: require('./engine/models/systems/map.js'),
            Physics: require('./engine/models/systems/physics.js')
        },
        Game: require('./engine/models/game.js'),
        input: require('./engine/models/input.js')
    },
    util: {
        gameio: require('./engine/util/gameio.js'),
        image_manager: require('./engine/util/image_manager.js'),
        util: require('./engine/util/util.js')
    },
    views: {
        Game: require('./engine/views/game.js'),
        Renderer: require('./engine/views/renderer.js')
    }
};
