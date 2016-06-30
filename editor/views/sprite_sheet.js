'use strict';

const {dialog} = require('electron').remote;

var fs = require('fs');
var path = require('path');
var sizeOf = require('image-size');

var $ = require('jquery');
var Handlebars = require('handlebars');
var View = require('../../lib/view.js');
var edit_sprite_sheet_tmpl = fs.readFileSync(__dirname + '/../tmpl/edit_sprite_sheet.html', 'utf8');

var SpriteSheet = require('../../engine/models/graphics/sprite_sheet.js');
var SpriteSheets = require('../../engine/models/graphics/sprite_sheets.js');
var image_manager = require('../../engine/util/image_manager.js');

class SpriteSheetEditor extends View {
    constructor(options) {
        super(options);
        this.game = options.game;
        this.original_path = '';
        this.template = Handlebars.compile(edit_sprite_sheet_tmpl);
        console.log(options);

        this.$element.on('click', '#save_sprite_sheet_button', this.save.bind(this));
    }
    select_sprite_sheet(event) {
        var choice = dialog.showOpenDialog({properties: ['openFile'], filters: [
            {name: 'Images', extensions: ['png']}
        ]});
        if (choice === undefined) {
            return;
        }

        choice = choice[0];

        var sprite_sheets_path = path.normalize(this.game.path + '/images/sprite_sheets/' + path.basename(choice));
        this.original_path = 'file://' + choice;

        var dimensions = sizeOf(choice);
        // fs.createReadStream(choice).pipe(fs.createWriteStream(sprite_sheets_path));

        this.model.set({
            id: path.basename(choice).replace('.', ''),
            name: path.basename(choice),
            path: path.basename(choice),
            width: dimensions.width,
            height: dimensions.height,
            tile_width: 32,
            tile_height: 32
        });

        this.render();
    }
    save() {
        //
    }
    render_grid() {
        var tiles_x = Math.floor(this.model.width / this.model.tile_width);
        var tiles_y = Math.floor(this.model.height / this.model.tile_height);

        var y_index = 0;
        var x_index = 0;
        for (y_index = 0; y_index < tiles_y; y_index += 1) {
            for (x_index = 0; x_index < tiles_x; x_index += 1) {
                var x = x_index * this.model.tile_width;
                var y = y_index * this.model.tile_height;
                var div = $("<div>").addClass('grid_cell').css({
                    left: x + 'px',
                    top: y + 'px',
                    width: (this.tile_width - 2) + 'px',
                    height: (this.tile_height - 2) + 'px',
                });
                this.$element.find('#sprite_sheet_grid').append(div);
            }
        }
    }
    render() {
        var render_data = this.model.serialize();
        render_data.original_path = this.original_path;
        render_data.game_path = this.game.path;
        this.$element.html(this.template(render_data));

        if (this.model.path === "") {
            this.select_sprite_sheet();
        } else {
            this.render_grid();
        }
    }
}

module.exports = SpriteSheetEditor;
