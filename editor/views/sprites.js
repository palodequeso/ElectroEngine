'use strict';

const {dialog} = require('electron').remote;

var fs = require('fs');
var path = require('path');
var sizeOf = require('image-size');
var fse = require('fs-extra');

var Handlebars = require('handlebars');
var View = require('exo').View;

var SpriteEditor = require('./sprite.js');

var Sprites = require('../../engine/models/graphics/sprites.js');

var edit_sprites_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/edit_sprites.html'), 'utf8');

class SpritesEditor extends View {
    get events() {
        return {
            'click .sprite_selector': this.select_sprite.bind(this)
        };
    }
    constructor(options) {
        super(options);
        this.game = options.game;
        this.sprites = new Sprites(options.sprites);
        this.sprite_sheet = options.sprite_sheet;
        this.original_path = path.join(this.game.path, 'images', 'sprite_sheets', this.sprite_sheet.path);
        this.template = Handlebars.compile(edit_sprites_tmpl);

        this.current_sprite = null;
    }
    select_sprite_sheet() {
        // TODO: Select from drop down.
    }
    select_sprite(event) {
        var sprite_id = event.target.dataset.id;
        console.log("Select Sprite: ", sprite_id, this.sprites);
        this.current_sprite = this.sprites.get(sprite_id);
        console.log("Current Sprite: ", this.current_sprite);
        this.render();
    }
    save(event) {
        event.preventDefault();
        event.stopPropagation();

        // TODO
    }
    render() {
        if (this.current_sprite === null) {
            var render_data = {
                sprite_sheet: this.sprite_sheet,
                sprites: this.sprites.serialize()
            };
            render_data.original_path = this.original_path;
            render_data.game_path = this.game.path;
            console.log("Render Data: ", render_data);
            this.element.innerHTML = this.template(render_data);
        } else {
            this.element.innerHTML = `<div>
                ${this.current_sprite.id}
            </div>`;
            var view = new SpriteEditor({
                model: this.current_sprite,
                game: this.game
            });
            view.render();
            this.element.appendChild(view.element);
        }
    }
}

module.exports = SpritesEditor;
