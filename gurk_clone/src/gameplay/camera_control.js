'use strict';

const Model = require('exo').Model;

const input = require('../../../engine/models/input.js');

class CameraControl extends Model {
    constructor(options) {
        super(options);
    }
    update(time_delta, camera) {
        const camera_velocity = [0, 0];
        const camera_speed = 8 * camera.scale[0];
        if (input.is_keydown(68)) {
            camera_velocity[0] = camera_speed;
        }
        if (input.is_keydown(65)) {
            camera_velocity[0] = -camera_speed;
        }
        if (input.is_keydown(87)) {
            camera_velocity[1] = camera_speed;
        }
        if (input.is_keydown(83)) {
            camera_velocity[1] = -camera_speed;
        }

        camera.position[0] -= camera_velocity[0];// * (frame_time / 1000);
        camera.position[1] -= camera_velocity[1];// * (frame_time / 1000);
        camera.calculate_matrix();
    }
}

module.exports = CameraControl;
