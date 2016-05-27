'use strict';

var util = require('../util/util.js');
var Model = require('../../lib/model.js');

// TODO: Move to systems?
class Input extends Model {
    get defaults() {
        return {
            key_states: {},
            click_data: {
                clicked: false,
                x: 0,
                y: 0
            }
        };
    }
    constructor(data) {
        super(data);
        this.setup_events();
    }
    keydown_handler(event) {
        console.log("KeyDown: ", event.keyCode);
        this.key_states[event.keyCode] = true;
    }
    keyup_handler(event) {
        console.log("KeyUp: ", event.keyCode);
        this.key_states[event.keyCode] = false;
    }
    click_handler(event) {
        console.log("Click: ", event);
        this.click_data.x = event.offsetX;
        this.click_data.y = event.offsetY;
        this.click_data.clicked = true;
    }
    is_keydown(key_code) {
        if (this.key_states.hasOwnProperty(key_code)) {
            return this.key_states[key_code];
        }
        return false;
    }
    is_clicked() {
        if (this.click_data.clicked) {
            this.click_data.clicked = false;
            return [this.click_data.x, this.click_data.y];
        }
        return null;
    }
    setup_events() {
        util.add_event(document, 'keydown', this.keydown_handler.bind(this));
        util.add_event(document, 'keyup', this.keyup_handler.bind(this));
        util.add_event(document, 'click', this.click_handler.bind(this));
    }
    update() {
        // this.click_data.clicked = false;
    }
}

// Singleton pattern
var input = new Input();

module.exports = input;
