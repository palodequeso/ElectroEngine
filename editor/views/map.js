'use strict';

var remote = require('remote');
var dialog = remote.require('dialog');

var fs = require('fs');
var path = require('path');

var $ = require('jquery');
var Handlebars = require('handlebars');
var View = require('../../lib/view.js');
var edit_map_tmpl = fs.readFileSync(__dirname + '/../tmpl/edit_map.html', 'utf8');

class MapEditor extends View {
    constructor(options) {
        super(options);
        this.template = Handlebars.compile(edit_map_tmpl);
    }
    render() {
        var map_data = this.model.serialize();
        this.$element.html(this.template(map_data));

        new hx.Collapsible('#layer_selector');
        new hx.DragContainer('#layer_selector_draggable_container');
    }
}

module.exports = MapEditor;
