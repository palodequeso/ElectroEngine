'use strict';

const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');
const View = require('exo').View;

const new_game_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/new_game.html'), 'utf8');

const Player = require('../../gameplay/player.js');
const PlayerView = require('./player.js');

class NewGame extends View {
    constructor(options) {
        super(options);
        this.template = Handlebars.compile(new_game_tmpl);
    }
    render() {
        this.element.innerHTML = this.template({});
        const player_view = new PlayerView({model: new Player()});
        player_view.render();
        this.element.querySelector('.new_players').appendChild(player_view.element);
    }
}

module.exports = NewGame;
