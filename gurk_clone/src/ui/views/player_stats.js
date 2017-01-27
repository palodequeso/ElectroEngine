'use strict';

const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');

const View = require('exo').View;

const player_stats_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/player_stats.html'), 'utf8');

const player_class_stat_bonuses = require('./../../gameplay/player_class_stat_bonuses.js');
const levels = require('./../../gameplay/levels.js');

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
        this.class = options.class;
        this.is_new = options.is_new || false;
    }
    save_to_model() {
        let quantity = 0;
        this.element.querySelectorAll('.player_stat_value').forEach(element => {
            quantity += parseInt(element.value, 10);
        });
        if (quantity !== this.model.max_stats) {
            hx.notify.negative(`Stats cannot total more than ${this.model.max_stats}, and must be between 8 and 32!`);
            console.log("Quantity: ", `${quantity} / ${this.model.max_stats}`);
            return false;
        }

        this.element.querySelectorAll('.player_stat_value').forEach(element => {
            const stat = element.dataset.stat;
            this.model[stat] = parseInt(element.value, 10);

            if (player_class_stat_bonuses.hasOwnProperty(this.class)) {
                this.model[stat] += player_class_stat_bonuses[this.class][stat];
            }
        });

        return true;
    }
    check_stat(elem, value, stat) {
        // let quantity = 0;
        // this.element.querySelectorAll('.player_stat_value').forEach(element => {
        //     quantity += parseInt(element.value, 10);
        // });
        //
        // if (quantity > this.model.max_stats) {
        //     quantity = this.model.max_stats - (quantity - value);
        //     elem.value = quantity;
        // }

        this.model[stat] = value; // quantity;

        this.update_stat_values();

        console.log(stat, value); // , quantity);
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
    update_stat_values() {
        this.element.querySelectorAll('.stat_bonus').forEach(element => {
            const stat = element.dataset.stat;
            let bonus = 0;
            if (player_class_stat_bonuses.hasOwnProperty(this.class)) {
                bonus = player_class_stat_bonuses[this.class][stat];
            }

            if (stat === 'constitution' && this.is_new) {
                const hp_bonus = Math.floor((this.model[stat] + bonus - 10) / 2.0);
                let hp_base = 8;
                if (this.class === 'fighter') {
                    hp_base = 10;
                }
                this.model.health = hp_base + hp_bonus;
                this.model.max_health = hp_base + hp_bonus;
            } else if (stat === 'intellect' && this.is_new) {
                const mana_bonus = Math.floor((this.model[stat] + bonus - 10) / 2.0);
                const mana_base = 8;
                this.model.mana = mana_base + mana_bonus;
                this.model.max_mana = mana_base + mana_bonus;
            }

            const new_value = this.model[stat] + bonus;
            if (bonus < 0) {
                element.innerHTML = ` -`;
            } else {
                element.innerHTML = ` +`;
            }
            element.innerHTML += ` ${bonus} = ${new_value}`;
        });
        let quantity = 0;
        this.element.querySelectorAll('.player_stat_value').forEach(element => {
            quantity += parseInt(element.value, 10);
        });
        this.element.querySelector('.stat_sum').innerHTML = quantity.toString();
    }
    render() {
        const render_data = this.model.serialize();
        render_data.next_level = levels[0];
        levels.forEach((level, index) => {
            if (render_data.experience > level && levels[index + 1] && render_data.experience < levels[index + 1]) {
                render_data.next_level = (levels[index + 1] ? levels[index + 1] : levels[index]);
            }
        });
        this.element.innerHTML = this.template(render_data);
        this.update_stat_values();
    }
}

module.exports = PlayerStats;
