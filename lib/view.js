'use strict';

var EventEmitter = require('events').EventEmitter;

class View extends EventEmitter {
    get tag() {
        return 'div';
    }
    get class_name() {
        return '';
    }
    get events() {
        return {};
    }
    constructor() {
        super();

        if (options !== undefined) {
            if (!options.hasOwnProperty('element')) {
                this.$element = $("<" + this.tag + ">");
                this.$element.addClass(this.class_name);
            } else {
                this.$element = options.$element;
            }
            if (options.hasOwnProperty('model')) {
                this.model = options.model;
            }
            if (options.hasOwnProperty('collection')) {
                this.collection = options.collection;
            }
        } else {
            this.$element = $("<" + this.tag + ">");
        }

        // Bind Events
        Object.keys(this.events).forEach((event_selector) => {
            var index_of = event_selector.indexOf(' ');
            var event_type;
            var selector;
            var method = this.events[event_selector];
            if (index_of !== -1) {
                event_type = event_selector.substr(0, index_of);
                selector = event_selector.substr(index_of + 1);
            } else {
                event_type = event_selector;
                selector = '';
            }

            if (selector !== '') {
                this.$element.on(event_type, selector, method);
            } else {
                this.$element.on(event_type, method);
            }
        });
    }
    render() {
        return this.element;
    }
}

module.exports = View;
