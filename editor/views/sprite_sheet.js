'use strict';

const {dialog} = require('electron').remote;

var fs = require('fs');
var path = require('path');
var sizeOf = require('image-size');

var Handlebars = require('handlebars');
var View = require('exo').View;
var edit_sprite_sheet_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/edit_sprite_sheet.html'), 'utf8');

class SpriteSheetEditor extends View {
    get events() {
        return {
            'click #save_sprite_sheet_button': this.save.bind(this)
        };
    }
    constructor(options) {
        super(options);
        this.game = options.game;
        this.original_path = path.join(this.game.path, 'images', 'sprite_sheets', this.model.path);
        this.template = Handlebars.compile(edit_sprite_sheet_tmpl);
    }
    select_sprite_sheet() {
        var choice = dialog.showOpenDialog({properties: ['openFile'], filters: [
            {name: 'Images', extensions: ['png']}
        ]});
        if (choice === undefined) {
            return;
        }

        choice = choice[0];

        // var sprite_sheets_path = path.normalize(this.game.path + '/images/sprite_sheets/' + path.basename(choice));
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
        console.log(this.model);
        var tiles_x = Math.floor(this.model.width / this.model.tile_width);
        var tiles_y = Math.floor(this.model.height / this.model.tile_height);

        var y_index = 0;
        var x_index = 0;
        for (y_index = 0; y_index < tiles_y; y_index += 1) {
            for (x_index = 0; x_index < tiles_x; x_index += 1) {
                var x = x_index * this.model.tile_width;
                var y = y_index * this.model.tile_height;
                var div = document.createElement('div');
                div.classList.add('grid_cell');
                div.style.left = x + 'px';
                div.style.top = y + 'px';
                div.style.width = (this.tile_width - 2) + 'px';
                div.style.height = (this.tile_height - 2) + 'px';
                this.element.querySelector('#sprite_sheet_grid').appendChild(div);
            }
        }
    }
    render() {
        var render_data = this.model.serialize();
        render_data.original_path = this.original_path;
        render_data.game_path = this.game.path;
        console.log("Render Data: ", render_data);
        this.element.innerHTML = this.template(render_data);

        if (this.model.path === "") {
            this.select_sprite_sheet();
        } else {
            this.render_grid();
        }
    }
}

module.exports = SpriteSheetEditor;
