"use strict";

var $ = require("jquery");
var View = require('../../lib/view.js');
var glmatrix = require("gl-matrix");
var View = require('../../lib/view.js');

var Renderer = require('./renderer.js');

class Game extends View {
    constructor(options) {
        super(options);

        this.renderer = new Renderer({
            model: this.model
        });
        $("body").append(this.renderer.$element);

        this.previous_time = 0.0;
        this.timer = new Timer();
        this.timer.start();
    }
    run() {
        var current_time = this.timer.milliseconds();
        var frame_time = current_time - this.previous_time;
        this.previous_time = current_time;
        if (this.running) {
            requestAnimationFrame(this.run);
        }
        this.model.update(frame_time);
        this.render();
    }
    render() {
        this.renderer.render();
    }
}

module.exports = Renderer;
