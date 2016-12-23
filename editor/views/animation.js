'use strict';

var fs = require('fs');
var path = require('path');

var Handlebars = require('handlebars');
var View = require('exo').View;
var edit_animation_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/edit_animation.html'), 'utf8');

class AnimationEditor extends View {
    constructor(options) {
        super(options);

        this.animation = options.animation;
        this.relative_path = options.relative_path;
        this.current_frame_index = 0;

        // this.element.style.background = `url(${this.relative_path})`;
        // this.element.style.width = this.model.width + 'px';
        // this.element.style.height = this.model.height + 'px';
        // this.element.style.display = 'inline-block';

        this.template = Handlebars.compile(edit_animation_tmpl);
    }
    render() {
        //
    }
}

module.exports = AnimationEditor;
