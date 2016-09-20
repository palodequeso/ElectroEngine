'use strict';

const {dialog} = require('electron').remote;

var fs = require('fs');
var path = require('path');
var sizeOf = require('image-size');

var $ = require('jquery');
var Handlebars = require('handlebars');
var View = require('../../lib/view.js');
var edit_map_tmpl = fs.readFileSync(__dirname + '/../tmpl/edit_map.html', 'utf8');
var map_editor_tools_tmpl = fs.readFileSync(__dirname + '/../tmpl/map_editor_tools.html', 'utf8');

var SpriteSheet = require('../../engine/models/graphics/sprite_sheet.js');
var SpriteSheets = require('../../engine/models/graphics/sprite_sheets.js');
var image_manager = require('../../engine/util/image_manager.js');

var Sidebar = require('./util.js').Sidebar;

class MapEditorTools extends Sidebar {
    constructor(options) {
        super(options);
        this.game = options.game;
        this.template = Handlebars.compile(map_editor_tools_tmpl);
    }
    render_content(content) {
        var map_data = this.model.serialize();
        map_data.sprite_sheets.forEach((sheet) => {
            var sprite_sheets_path = path.normalize(this.game.path + '/images/sprite_sheets/' + sheet.path);
            console.log("Sprite Sheets Path: ", sprite_sheets_path);
            sheet.modified_path = sprite_sheets_path;
            sheet.modified_path = path.relative(path.normalize(__dirname + '/../'), sprite_sheets_path);
            sheet.modified_path = sheet.modified_path.replace(/\\/gmi, '/');
            sheet.tiles_x = sheet.width / sheet.tile_width;
            sheet.tiles_y = sheet.height / sheet.tile_height;
        });

        console.log("Map Data: ", map_data);

        setTimeout(() => {
            content.append(this.template(map_data));

            new hx.Collapsible('#layer_selector');
            new hx.DragContainer('#layer_selector_draggable_container');

            new hx.Collapsible('#sprite_selector');
            if (map_data.sprite_sheets.length) {
                new hx.Tabs('#sprite_sheet_tabs');
            }

            new hx.Collapsible('#map_properties');

            map_data.sprite_sheets.forEach((sheet) => {
                var tile_div = $(this.$element.find("#sprite_sheet_" + sheet.id + "_content").find(".sprite_selector_tiles"));
                console.log(tile_div);
                tile_div.css({
                    width: sheet.width,
                    height: sheet.height
                });

                var i = 0;
                var j = 0;
                var tile_index = 0;
                for (j = 0; j < (sheet.height / sheet.tile_height); j += 1) {
                    for (i = 0; i < (sheet.width / sheet.tile_width); i += 1) {
                        var div = $('<div>').addClass('sprite_sheet_tile_selector').css({
                            width: sheet.tile_width,
                            height: sheet.tile_height
                        }).data('tile_index', tile_index).data('sprite_sheet_id', sheet.id);
                        tile_div.append(div);
                        tile_index += 1;
                    }
                }
            });
        }, 100);
    }
}

class MapEditor extends View {
    constructor(options) {
        super(options);
        this.game = options.game;
        console.log(options);

        if (this.model.sprite_sheets === null) {
            this.model.sprite_sheets = new SpriteSheets();
        }

        this.tools = new MapEditorTools({
            game: this.game,
            model: this.model
        });
        this.tools.on('resize', this.tools_resize.bind(this));

        this.$element.on('click', '#add_sprite_sheet_button', this.add_sprite_sheet.bind(this));
        this.$element.on('change', '.sprite_sheet_tile_width', this.tile_size_change.bind(this));
        this.$element.on('change', '.sprite_sheet_tile_height', this.tile_size_change.bind(this));
        this.$element.on('click', '.sprite_sheet_tile_selector', this.select_tile.bind(this));
    }
    tools_resize(width) {
        console.log("Tools Resize: ", width, $(this.$element.find("#map_editor_tiles")));
        $(this.$element.find("#map_editor_tiles")).css({
            width: 'calc(100% - ' + width + 'px)'
        });
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
        if (choice === undefined) {
            return;
        }

        choice = choice[0];

        console.log(this.game.path, choice);
        var sprite_sheets_path = path.normalize(this.game.path + '/sprite_sheets/' + path.basename(choice));
        console.log("SPrite Sheet Path: ", sprite_sheets_path);
        var dimensions = sizeOf(choice);
        console.log(choice, sprite_sheets_path, dimensions);
        console.log("Copy", choice, "to", sprite_sheets_path);
        fs.createReadStream(choice).pipe(fs.createWriteStream(sprite_sheets_path));

        var sprite_sheet = new SpriteSheet({
            id: path.basename(choice).replace('.', ''),
            name: path.basename(choice),
            path: path.basename(choice),
            width: dimensions.width,
            height: dimensions.height
        });
        this.model.sprite_sheets.add(sprite_sheet);
        this.render();
    }
    select_tile(event) {
        var $elem = $(event.currentTarget);
        var tile_index = parseInt($elem.data('tile_index'), 10);
        var sprite_sheet_id = $elem.data('sprite_sheet_id');
        console.log("Select Tile: ", tile_index, sprite_sheet_id);
    }
    render() {
        this.$element.html(edit_map_tmpl);

        this.tools.render();
        this.$element.find("#map_editor_container").append(this.tools.$element);

        var tiles = this.$element.find('#map_editor_tiles');
        tiles.empty();
        var editor_div = $("<div>");

        var i = 0;
        var j = 0;
        var tile_index = 0;
        for (j = 0; j < this.model.height; j += 1) {
            for (i = 0; i < this.model.width; i += 1) {
                var div = $('<div>').addClass('map_tile').data('tile_index', tile_index);
                div.css({
                    width: this.model.tile_width,
                    height: this.model.tile_height
                });
                editor_div.append(div);
                tile_index += 1;
            }
        }

        editor_div.css({
            width: this.model.tile_width * this.model.width,
            height: this.model.tile_height * this.model.height
        });
        tiles.append(editor_div);
    }
}

module.exports = MapEditor;
