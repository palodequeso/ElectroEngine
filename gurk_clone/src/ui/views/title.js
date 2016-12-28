'use strict';

var fs = require('fs');
var path = require('path');

var Handlebars = require('handlebars');
var View = require('exo').View;
var title_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/title.html'), 'utf8');

class Title extends View {
    get events() {
        return {
            'click .continue_game': this.continue_game.bind(this),
            'click .new_game': this.new_game.bind(this),
            'click .game_options': this.game_options.bind(this),
            'click .exit_game': this.exit_game.bind(this)
        };
    }
    constructor(options) {
        super(options);
        //this.template = Handlebars.compile(title_tmpl);
    }
    continue_game() {
        //
    }
    new_game() {
        //
    }
    game_options() {
        //
    }
    exit_game() {
        //
    }
    render() {
        //this.element.innerHTML = this.template(this.model.serialize());
        this.element.innerHTML = title_tmpl;
    }
}

module.exports = Title;
