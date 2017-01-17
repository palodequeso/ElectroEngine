'use strict';

const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');

const View = require('exo').View;

const player_stats_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/player_stats.html'), 'utf8');

class PlayerStats extends View {
    get events() {
        return {
            'change .player_stat_value': this.change_stat.bind(this)
        };
    }
    constructor(options) {
        super(options);
        this.template = Handlebars.compile(player_stats_tmpl);
    }
    change_stat(event) {
        const elem = event.target;
        const value = parseInt(elem.value, 10);
        const stat = elem.dataset.stat;

        let quantity = 0;
        this.element.querySelectorAll('.player_stat_value').forEach(element => {
            quantity += parseInt(element.value, 10);
        });

        if (quantity >= this.model.max_stats) {
            quantity = quantity - (this.model.max_stats - quantity);
            elem.value = quantity;
        }

        console.log(stat, value, quantity);
    }
    render() {
        this.element.innerHTML = this.template(this.model.serialize());
    }
}

module.exports = PlayerStats;
