"use strict";

var $ = require("jquery");
var glmatrix = require("gl-matrix");
var View = require('exo').View;
var Timer = require('exo').Timer;
var Renderer = require('./renderer.js');

class Game extends View {
    constructor(options) {
        super(options);

        this.renderer = new Renderer({
            model: this.model
        });
        $("body").append(this.renderer.element);

        this.previous_time = 0.0;
        this.timer = new Timer();
        this.timer.start();
        this.running = true;
    }
    run() {
        var current_time = this.timer.milliseconds();
        var frame_time = current_time - this.previous_time;
        this.previous_time = current_time;
        if (this.running) {
            requestAnimationFrame(this.run.bind(this));
        }
        this.model.update(frame_time);
        this.render();
    }
    render() {
        this.renderer.render();
    }
}

module.exports = Game;
