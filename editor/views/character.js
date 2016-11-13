'use strict';

// const {dialog} = require('electron').remote;

var fs = require('fs');
var path = require('path');
// var sizeOf = require('image-size');

var Handlebars = require('handlebars');
var View = require('exo').View;
var character_editor_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/character_editor.html'), 'utf8');

class CharacterEditor extends View {
    get events() {
        return {
            // 'click #save_sprite_sheet_button': this.save.bind(this)
        };
    }
    constructor(options) {
        super(options);
        this.game = options.game;
        this.template = Handlebars.compile(character_editor_tmpl);
    }
    save() {
        //
    }
    render() {
        var render_data = this.model.serialize();
        this.element.innerHTML = this.template(render_data);
    }
}

module.exports = CharacterEditor;
