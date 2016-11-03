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
            'click #save_particle_system_button': this.save.bind(this)
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
    save(event) {
        event.preventDefault();
        event.stopPropagation();
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
        render_data.position_range_begin_x = render_data.position_range[0][0];
        render_data.position_range_begin_y = render_data.position_range[0][1];
        render_data.position_range_end_x = render_data.position_range[1][0];
        render_data.position_range_end_y = render_data.position_range[1][1];
        render_data.velocity_range_begin_x = render_data.velocity_range[0][0];
        render_data.velocity_range_begin_y = render_data.velocity_range[0][1];
        render_data.velocity_range_end_x = render_data.velocity_range[1][0];
        render_data.velocity_range_end_y = render_data.velocity_range[1][1];
        render_data.life_range_begin = render_data.life_range[0];
        render_data.life_range_end = render_data.life_range[1];
        render_data.decay_range_begin = render_data.decay_range[0];
        render_data.decay_range_end = render_data.decay_range[1];
        render_data.fade_range_begin = render_data.fade_range[0];
        render_data.fade_range_end = render_data.fade_range[1];
        render_data.width_range_begin = render_data.width_range[0];
        render_data.width_range_end = render_data.width_range[1];
        render_data.height_range_begin = render_data.height_range[0];
        render_data.height_range_end = render_data.height_range[1];
        this.element.innerHTML = this.template(render_data);

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
