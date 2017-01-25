'use strict';

const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');

const View = require('exo').View;

const player_summary_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/player_summary.html'), 'utf8');

class PlayerSummary extends View {
    get events() {
        return {
            'change .player_class': this.change_player_class.bind(this)
        };
    }
    constructor(options) {
        super(options);
        this.template = Handlebars.compile(player_summary_tmpl);
    }
    save_to_model() {
        const player_name = this.element.querySelector('.player_name').value;
        const player_class = this.element.querySelector('.player_class').value;

        this.model.name = player_name;
        this.model.class = player_class;

        if (player_name === '' || player_class === '') {
            hx.notify.negative(`You must provide a name and select a class!`);
            return false;
        }

        return true;
    }
    change_player_class() {
        const player_class = this.element.querySelector('.player_class').value;
        if (player_class === '') {
            return;
        }

        this.model.class = player_class;
        this.emit('class_change');
    }
    render() {
        this.element.innerHTML = this.template(this.model.serialize());
    }
}

module.exports = PlayerSummary;
