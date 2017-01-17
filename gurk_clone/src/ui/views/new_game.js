'use strict';

const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');
const View = require('exo').View;

const new_game_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/new_game.html'), 'utf8');

const Player = require('../../gameplay/player.js');
const PlayerView = require('./player.js');

class NewGame extends View {
    get events() {
        return {
            'click .creat_party': this.next_player.bind(this),
            'click .next_player': this.next_player.bind(this)
        };
    }
    constructor(options) {
        super(options);
        this.template = Handlebars.compile(new_game_tmpl);
        this.content = null;
        this.players = [];
    }
    next_player() {
        if (this.players.length === 4) {
            // DONE
        } else {
            const player_view = new PlayerView({model: new Player()});
            player_view.render();
            this.content.innerHTML = '';
            this.content.appendChild(player_view.element);
            player_view.element.querySelector('.next_player').style.display = 'block';
        }
    }
    render() {
        this.element.innerHTML = this.template({});
        this.content = this.element.querySelector('.modal-content');
    }
}

module.exports = NewGame;
