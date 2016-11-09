'use strict';

// const {dialog} = require('electron').remote;

var fs = require('fs');
var path = require('path');

// var sizeOf = require('image-size');
var Handlebars = require('handlebars');

var View = require('exo').View;
var Timer = require('exo').Timer;

var GraphicsSystem = require('../../engine/models/systems/graphics.js');
var Entity = require('../../engine/models/ecs/entity.js');
// var ParticleSystem = require('../../engine/models/particle_systems/particle_system.js');
var ParticleSystemInstance = require('../../engine/models/particle_systems/particle_system_instance.js');
var ParticleSystemComponent = require('../../engine/models/components/particle_system.js');
var Game = require('../../engine/models/game.js');
var Renderer = require('../../engine/views/renderer.js');
var edit_particle_system_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/particle_system_editor.html'), 'utf8');

class ParticleSystemEditor extends View {
    get events() {
        return {
            'click #save_particle_system_button': this.save.bind(this),
            'change input': this.input_changed.bind(this)
        };
    }
    constructor(options) {
        super(options);
        this.game = options.game;
        this.init_test_game();
        this.renderer = null;
        this.template = Handlebars.compile(edit_particle_system_tmpl);

        this.previous_time = 0.0;
        this.timer = new Timer();
        this.timer.start();
        this.running = true;
    }
    init_test_game() {
        var test_path = path.relative(path.join(__dirname, '../../'), this.game.path);
        this.test_game = new Game({
            path: test_path,
            systems: [new GraphicsSystem()]
        });
        console.log(this.model);
        this.test_game.particle_systems.add(this.model);
        var entity = new Entity();
        var instance = new ParticleSystemInstance({
            particle_system: this.model,
            position: [0, 0]
        });
        entity.components.add(new ParticleSystemComponent({
            name: 'test_system_instance',
            particle_system_instance: instance
        }));
        this.test_game.entities.add(entity);
    }
    get_values() {
        var start_color_begin = this.element.querySelector('#start_color_range_begin').value.split(',');
        var start_color_end = this.element.querySelector('#start_color_range_end').value.split(',');
        var end_color_begin = this.element.querySelector('#end_color_range_begin').value.split(',');
        var end_color_end = this.element.querySelector('#end_color_range_end').value.split(',');

        start_color_begin[0] = parseFloat(start_color_begin[0]);
        start_color_begin[1] = parseFloat(start_color_begin[1]);
        start_color_begin[2] = parseFloat(start_color_begin[2]);
        start_color_end[0] = parseFloat(start_color_end[0]);
        start_color_end[1] = parseFloat(start_color_end[1]);
        start_color_end[2] = parseFloat(start_color_end[2]);
        end_color_begin[0] = parseFloat(end_color_begin[0]);
        end_color_begin[1] = parseFloat(end_color_begin[1]);
        end_color_begin[2] = parseFloat(end_color_begin[2]);
        end_color_end[0] = parseFloat(end_color_end[0]);
        end_color_end[1] = parseFloat(end_color_end[1]);
        end_color_end[2] = parseFloat(end_color_end[2]);

        return {
            id: this.element.querySelector('.particle_system_id').value,
            name: this.element.querySelector('.particle_system_name').value,
            emission_rate: parseInt(this.element.querySelector('.particle_system_emission_rate').value, 10),
            particle_count: parseInt(this.element.querySelector('.particle_system_particle_count').value, 10),
            position_range: [
                [
                    parseFloat(this.element.querySelector('.particle_system_position_range_begin_x').value),
                    parseFloat(this.element.querySelector('.particle_system_position_range_begin_y').value)
                ],
                [
                    parseFloat(this.element.querySelector('.particle_system_position_range_end_x').value),
                    parseFloat(this.element.querySelector('.particle_system_position_range_end_y').value)
                ]
            ],
            velocity_range: [
                [
                    parseFloat(this.element.querySelector('.particle_system_velocity_range_begin_x').value),
                    parseFloat(this.element.querySelector('.particle_system_velocity_range_begin_y').value)
                ],
                [
                    parseFloat(this.element.querySelector('.particle_system_velocity_range_end_x').value),
                    parseFloat(this.element.querySelector('.particle_system_velocity_range_end_y').value)
                ]
            ],
            life_range: [
                parseFloat(this.element.querySelector('.particle_system_life_range_begin').value),
                parseFloat(this.element.querySelector('.particle_system_life_range_end').value)
            ],
            decay_range: [
                parseFloat(this.element.querySelector('.particle_system_decay_range_begin').value),
                parseFloat(this.element.querySelector('.particle_system_decay_range_end').value)
            ],
            fade_range: [
                parseFloat(this.element.querySelector('.particle_system_fade_range_begin').value),
                parseFloat(this.element.querySelector('.particle_system_fade_range_end').value)
            ],
            width_range: [
                parseFloat(this.element.querySelector('.particle_system_width_range_begin').value),
                parseFloat(this.element.querySelector('.particle_system_width_range_end').value)
            ],
            height_range: [
                parseFloat(this.element.querySelector('.particle_system_height_range_begin').value),
                parseFloat(this.element.querySelector('.particle_system_height_range_end').value)
            ],
            start_color_range: [start_color_begin, start_color_end],
            end_color_range: [end_color_begin, end_color_end]
        };
    }
    save(event) {
        event.preventDefault();
        event.stopPropagation();

        var values = this.get_values();
        var new_id = values.id;
        this.model.set(values);

        var current_path = path.normalize(path.join(this.game.path, 'particle_systems',
                                                    this.model.id.toString() + '.json'));
        var new_path = path.normalize(path.join(this.game.path, 'particle_systems',
                                                new_id + '.json'));
        this.model.id = new_id;

        if (current_path !== new_path) {
            fse.copySync(current_path, new_path);
        }

        var out = this.model.serialize();
        delete out.sprites;
        out = JSON.stringify(out, null, 4);
        fs.writeFileSync(new_path, out);
    }
    input_changed() {
        var values = this.get_values();
        this.model.set(values);
    }
    run() {
        var current_time = this.timer.milliseconds();
        var frame_time = current_time - this.previous_time;
        this.previous_time = current_time;
        if (this.running) {
            requestAnimationFrame(this.run.bind(this));
        }
        this.test_game.update(frame_time);
        this.renderer.render();
    }
    render() {
        var render_data = this.model.serialize();
        console.log("Render Data: ", render_data);
        this.element.innerHTML = this.template(render_data);

        // Implement Color Pickers (hexagon);
        var color_ranges = {
            start: [
                 new hx.ColorPicker("#start_color_range_begin"),
                 new hx.ColorPicker("#start_color_range_end")
            ],
            end: [
                 new hx.ColorPicker("#end_color_range_begin"),
                 new hx.ColorPicker("#end_color_range_end")
            ]
        };

        color_ranges.start[0].on('change', color => {
            var rgb = color.rgb();
            color = [(rgb[0] / 256.0).toFixed(4), (rgb[1] / 256.0).toFixed(4), (rgb[2] / 256.0).toFixed(4)];
            this.element.querySelector("#start_color_range_begin").value = color;
            this.input_changed();
        });
        color_ranges.start[1].on('change', color => {
            var rgb = color.rgb();
            color = [(rgb[0] / 256.0).toFixed(4), (rgb[1] / 256.0).toFixed(4), (rgb[2] / 256.0).toFixed(4)];
            this.element.querySelector("#start_color_range_end").value = color;
            this.input_changed();
        });
        color_ranges.end[0].on('change', color => {
            var rgb = color.rgb();
            color = [(rgb[0] / 256.0).toFixed(4), (rgb[1] / 256.0).toFixed(4), (rgb[2] / 256.0).toFixed(4)];
            this.element.querySelector("#end_color_range_begin").value = color;
            this.input_changed();
        });
        color_ranges.end[1].on('change', color => {
            var rgb = color.rgb();
            color = [(rgb[0] / 256.0).toFixed(4), (rgb[1] / 256.0).toFixed(4), (rgb[2] / 256.0).toFixed(4)];
            this.element.querySelector("#end_color_range_end").value = color;
            this.input_changed();
        });

        if (this.renderer === null) {
            this.renderer = new Renderer({
                path_prefix: '../' + path.basename(this.game.path) + '/',
                model: this.test_game,
                element: this.element.querySelector('.particle_system_canvas_container')
            });
        }

        this.run();
    }
}

module.exports = ParticleSystemEditor;
