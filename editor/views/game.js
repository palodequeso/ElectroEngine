'use strict';

var fs = require('fs');
var $ = require('jquery');
var Handlebars = require('handlebars');
var View = require('../../lib/view.js');
var create_game_tmpl = fs.readFileSync(__dirname + '/../tmpl/game.html', 'utf8');

class CreateGameView extends View {
    constructor(options) {
        super(options);
        this.template = Handlebars.compile(create_game_tmpl);
    }
    render() {
        this.$element.html(this.template({}));
    }
}

module.exports = {
    CreateGameView: CreateGameView
};
