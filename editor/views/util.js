'use strict';

const {dialog} = require('electron').remote;

var fs = require('fs');
var path = require('path');
var sizeOf = require('image-size');

// var Draggable = require('draggable');

var $ = require('jquery');
var Handlebars = require('handlebars');
var View = require('../../lib/view.js');
var sidebar_tmpl = fs.readFileSync(__dirname + '/../tmpl/sidebar.html', 'utf8');

class Sidebar extends View {
    get class_name() {
        return 'side_toolbar'
    }
    constructor(options) {
        super(options);
        this.template = Handlebars.compile(sidebar_tmpl);
        this.drag_data = {
            mouse: [0, 0],
            dragging: false
        };
    }
    resize_start(event) {
        console.log("Resize Start");
        this.drag_data.dragging = true;
        this.drag_data.mouse = [event.pageX, event.pageY];
    }
    resize_end(event) {
        console.log("Resize End");
        this.drag_data.dragging = false;
        this.drag_data.mouse = [event.pageX, event.pageY];
    }
    resize(event) {
        console.log("Resize");
        event.preventDefault();
        event.stopPropagation();

        if (this.drag_data.dragging && event.pageX && event.pageY) {
            var dx = event.pageX - this.drag_data.mouse[0];
            var dy = event.pageY - this.drag_data.mouse[1];
            this.drag_data.mouse = [event.pageX, event.pageY];
            this.$element.width(this.$element.width() - dx);
            console.log("Resize: ", this.$element.width());
            this.emit('resize', this.$element.width());
        }

        return false;
    }
    render_content(container) {
        console.log("Render Content");
        container.append($('<div>test</div>'));
    }
    render() {
        console.log("Side Toolbar Render");
        this.$element.addClass('side_toolbar');
        this.$element.html(sidebar_tmpl);
        // new Draggable(this.$element.find('.sidebar_handle'), {
            // onDrag: this.resize.bind(this)
        // });
        $(this.$element.find('.sidebar_handle')).on('dragstart', this.resize_start.bind(this));
        $(this.$element.find('.sidebar_handle')).on('drag', this.resize.bind(this));
        $(this.$element.find('.sidebar_handle')).on('dragend', this.resize_end.bind(this));
        this.render_content(this.$element.find('.sidebar_content'));
    }
}

module.exports = {
    Sidebar: Sidebar
};
