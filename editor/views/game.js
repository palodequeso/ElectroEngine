'use strict';

var remote = require('remote');
var dialog = remote.require('dialog');

var fs = require('fs');
var path = require('path');

var $ = require('jquery');
var Handlebars = require('handlebars');
var View = require('../../lib/view.js');
var create_game_tmpl = fs.readFileSync(__dirname + '/../tmpl/create_game.html', 'utf8');

class CreateGameView extends View {
    constructor(options) {
        super(options);
        this.template = Handlebars.compile(create_game_tmpl);

        this.$element.on('click', '#save_button', this.save.bind(this));
    }
    save(event) {
        event.preventDefault();
        event.stopPropagation();

        var data = {
            name: this.$element.find('#game_name').val(),
            description: this.$element.find('#game_description').val(),
            version: this.$element.find('#game_version').val()
        };
        var result = dialog.showOpenDialog({properties: ['openDirectory']});
        if (result !== undefined) {
            fs.writeFileSync(path.normalize(result + '/game.json'), JSON.stringify(data));
            fs.mkdirSync(path.normalize(result + '/sprite_sheets'));
        }
        this.emit('created');
        console.log("Do Create Game");

        return false;
    }
    render() {
        this.$element.html(this.template({}));
    }
}

module.exports = {
    CreateGameView: CreateGameView
};
