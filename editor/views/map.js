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
        this.game = options.game;
        this.template = Handlebars.compile(edit_map_tmpl);
        console.log(options);

        this.$element.on('click', '#add_sprite_sheet_button', this.add_sprite_sheet.bind(this));
    }
    add_sprite_sheet(event) {
        console.log("Add Sprite Sheet");
        var choice = dialog.showOpenDialog({properties: ['openFile'], filters: [
            {name: 'Images', extensions: ['png']}
        ]});
        choice = choice[0];

        console.log(this.game.path);
        var sprite_sheets_path = path.normalize(this.game.path + '/sprite_sheets/' + path.basename(choice));
        console.log(choice, sprite_sheets_path);
        fs.createReadStream(choice).pipe(fs.createWriteStream(sprite_sheets_path));

        var relative_img_path = path.relative(path.normalize(__dirname + '/../'), sprite_sheets_path);

        var img = new Image();
        img.onload = function() {
            console.log(img);
        };

        // TODO: Problem here!
        img.src = relative_img_path;
        console.log(relative_img_path);
    }
    render() {
        var map_data = this.model.serialize();
        this.$element.html(this.template(map_data));

        new hx.Collapsible('#layer_selector');
        new hx.DragContainer('#layer_selector_draggable_container');

        new hx.Collapsible('#sprite_selector');
        new hx.Tabs('#sprite_sheet_tabs');

        new hx.Collapsible('#map_properties');
    }
}

module.exports = MapEditor;
