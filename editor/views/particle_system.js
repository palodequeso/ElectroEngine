'use strict';

// const {dialog} = require('electron').remote;

// var fs = require('fs');
// var path = require('path');
// var sizeOf = require('image-size');

// var Handlebars = require('handlebars');
var View = require('exo').View;
// var edit_sprite_sheet_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/edit_sprite_sheet.html'), 'utf8');

class ParticleSystemEditor extends View {
    get events() {
        return {
            // 'click #save_sprite_sheet_button': this.save.bind(this)
        };
    }
    constructor(options) {
        super(options);
        this.game = options.game;
        // this.template = Handlebars.compile(edit_sprite_sheet_tmpl);
    }
    save() {
        //
    }
    render() {
        var render_data = this.model.serialize();
        // this.element.innerHTML = this.template(render_data);
    }
}

module.exports = ParticleSystemEditor;