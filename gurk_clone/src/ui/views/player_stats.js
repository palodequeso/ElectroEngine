'use strict';

const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');

const View = require('exo').View;

const player_stats_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/player_stats.html'), 'utf8');

class PlayerStats extends View {
    get events() {
        return {
            'change .player_stat_value': this.change_stat.bind(this),
            'click .player_stat_down_button': this.stat_down.bind(this),
            'click .player_stat_up_button': this.stat_up.bind(this)
        };
    }
    constructor(options) {
        super(options);
        this.template = Handlebars.compile(player_stats_tmpl);
    }
    check_stat(elem, value, stat) {
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
    stat_down(event) {
        const elem = event.target.parentNode;
        const stat = elem.dataset.stat;
        console.log("stat: ", elem.dataset.stat);
        const stat_elem = elem.parentNode.querySelector(`.player_stat_value`);
        let value = parseInt(stat_elem.value, 10);
        value -= (value <= 8) ? 0 : 1;
        stat_elem.value = value;
        this.check_stat(stat_elem, value, stat);
    }
    stat_up(event) {
        const elem = event.target.parentNode;
        const stat = elem.dataset.stat;
        console.log("stat: ", elem.dataset.stat);
        const stat_elem = elem.parentNode.querySelector(`.player_stat_value`);
        let value = parseInt(stat_elem.value, 10);
        value += (value >= 32) ? 0 : 1;
        stat_elem.value = value;
        this.check_stat(stat_elem, value, stat);
    }
    change_stat(event) {
        const elem = event.target;
        const value = parseInt(elem.value, 10);
        const stat = elem.dataset.stat;
        this.check_stat(elem, value, stat);
    }
    render() {
        this.element.innerHTML = this.template(this.model.serialize());
    }
}

module.exports = PlayerStats;
