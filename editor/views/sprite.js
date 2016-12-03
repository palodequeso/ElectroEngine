'use strict';

const {dialog} = require('electron').remote;

var fs = require('fs');
var path = require('path');
var sizeOf = require('image-size');
var fse = require('fs-extra');

var Handlebars = require('handlebars');
var View = require('exo').View;
var edit_sprite_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/edit_sprite.html'), 'utf8');

class SpriteAnimation extends View {
    constructor(options) {
        super(options);

        this.animation = options.animation;
        this.relative_path = options.relative_path;
        this.current_frame_index = 0;
        console.log(this.model, this.animation, this.relative_path);

        // this.element.setAttribute('src', this.original_path);
        this.element.style.background = `url(${this.relative_path})`;
        this.element.style.width = this.model.width + 'px';
        this.element.style.height = this.model.height + 'px';
        this.element.style.display = 'inline-block';
    }
    render() {
        var frame = this.animation.frames[this.current_frame_index];
        var tile = this.model.tiles[frame.index];
        // var index = frame.index;

        this.element.style['background-position'] = `-${tile.css_offset_x}px -${tile.css_offset_y}px`;

        this.current_frame_index += 1;
        if (this.current_frame_index >= this.animation.frames.length) {
            this.current_frame_index = 0;
        }
        setTimeout(this.render.bind(this), frame.duration);
    }
}

class SpriteEditor extends View {
    get events() {
        return {
            'click #save_sprite_sheet_button': this.save.bind(this),
            'change .sprite_sheet_tile_width': this.adjust_tile_size.bind(this),
            'change .sprite_sheet_tile_height': this.adjust_tile_size.bind(this),
            'change .sprite_sheet_path': this.adjust_path.bind(this)
        };
    }
    constructor(options) {
        super(options);
        this.game = options.game;
        this.original_path = path.join(this.game.path, 'images', 'sprite_sheets', this.model.sprite_sheet.path);
        this.template = Handlebars.compile(edit_sprite_tmpl);
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
    save(event) {
        event.preventDefault();
        event.stopPropagation();

        // NOTE: Path, Width and Height should not be changable!
        var new_id = this.element.querySelector('.sprite_sheet_id').value;
        this.model.sheet_path = this.element.querySelector('.sprite_sheet_path').value;
        this.model.name = this.element.querySelector('.sprite_sheet_name').value;
        this.model.width = parseInt(this.element.querySelector('.sprite_sheet_width').value, 10);
        this.model.height = parseInt(this.element.querySelector('.sprite_sheet_height').value, 10);
        this.model.tile_width = parseInt(this.element.querySelector('.sprite_sheet_tile_width').value, 10);
        this.model.tile_height = parseInt(this.element.querySelector('.sprite_sheet_tile_height').value, 10);

        var current_path = path.normalize(path.join(this.game.path, 'sprite_sheets',
                                                    this.model.id.toString() + '.json'));
        var new_path = path.normalize(path.join(this.game.path, 'sprite_sheets',
                                                new_id + '.json'));
        this.model.id = new_id;

        if (current_path !== new_path) {
            fse.copySync(current_path, new_path);
        }

        var out = this.model.serialize();
        delete out.sprites;
        out = JSON.stringify(out, null, 4);
        fs.writeFileSync(new_path, out);
    }
    adjust_tile_size() {
        this.model.tile_width = parseInt(this.element.querySelector('.sprite_sheet_tile_width').value, 10);
        this.model.tile_height = parseInt(this.element.querySelector('.sprite_sheet_tile_height').value, 10);
        this.render_grid();
    }
    adjust_path() {
        this.model.path = this.element.querySelector('.sprite_sheet_path').value;
        this.original_path = path.join(this.game.path, 'images', 'sprite_sheets', this.model.path);
        this.render();
    }
    render_grid() {
        console.log(this.model);
        this.element.querySelector('#sprite_sheet_grid').innerHTML = '';
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
                div.style.width = (this.model.tile_width - 2) + 'px';
                div.style.height = (this.model.tile_height - 2) + 'px';
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

        var relative_path = `../${this.game.id}/data/images/sprite_sheets/${this.model.sprite_sheet.path}`;
        this.element.querySelectorAll('.sprite_animation_selector').forEach(element => {
            var id = element.dataset.id;
            console.log("Animation: ", id);
            var animation = this.model.animations[id];

            var animation_view = new SpriteAnimation({
                model: this.model,
                animation: animation,
                relative_path: relative_path,
                element: element.querySelector('.animation_preview')
            });
            animation_view.render();
        });
    }
}

module.exports = SpriteEditor;
