'use strict';

var remote = require('remote');
var dialog = remote.require('dialog');

var fs = require('fs');
var path = require('path');

var $ = require('jquery');
var Handlebars = require('handlebars');
var View = require('../../lib/view.js');
var edit_map_tmpl = fs.readFileSync(__dirname + '/../tmpl/edit_map.html', 'utf8');

var SpriteSheet = require('../../engine/models/sprite_sheet.js');
var SpriteSheets = require('../../engine/models/sprite_sheets.js');
var image_manager = require('../../engine/util/image_manager.js');

class MapEditor extends View {
    constructor(options) {
        super(options);
        this.game = options.game;
        this.template = Handlebars.compile(edit_map_tmpl);
        console.log(options);

        if (this.model.sprite_sheets === null) {
            this.model.sprite_sheets = new SpriteSheets();
        }

        this.$element.on('click', '#add_sprite_sheet_button', this.add_sprite_sheet.bind(this));
        this.$element.on('change', '.sprite_sheet_tile_width', this.tile_size_change.bind(this));
        this.$element.on('change', '.sprite_sheet_tile_height', this.tile_size_change.bind(this));
    }
    tile_size_change(event) {
        var $elem = $(event.currentTarget);
        var id = $elem.data('id');
        var value = $elem.val();
        console.log("Tile Size Change: ", id, value);
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

        var sprite_sheet = new SpriteSheet({
            id: path.basename(choice).replace('.', ''),
            name: path.basename(choice),
            path: path.basename(choice)
        });
        this.model.sprite_sheets.add(sprite_sheet);
        this.render();
    }
    render() {
        var map_data = this.model.serialize();
        var sprite_sheet_paths = [];
        map_data.sprite_sheets.forEach((sheet) => {
            var sprite_sheets_path = path.normalize(this.game.path + '/sprite_sheets/' + sheet.path);
            sheet.modified_path = path.relative(path.normalize(__dirname + '/../'), sprite_sheets_path);
            sheet.modified_path = sheet.modified_path.replace(/\\/gmi, '/');
            sprite_sheet_paths.push(sheet.modified_path);
        });

        //

        console.log("Map Data: ", map_data);
        var html = this.template(map_data);
        console.log(html);

        setTimeout(() => {
            this.$element.html(html);

            new hx.Collapsible('#layer_selector');
            new hx.DragContainer('#layer_selector_draggable_container');

            new hx.Collapsible('#sprite_selector');
            if (map_data.sprite_sheets.length) {
                new hx.Tabs('#sprite_sheet_tabs');
            }

            new hx.Collapsible('#map_properties');
        }, 100);
    }
}

module.exports = MapEditor;
