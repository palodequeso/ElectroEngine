'use strict';

const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');

const View = require('exo').View;

const player_inventory_summary_tmpl = fs.readFileSync(path.join(__dirname,
    '/../tmpl/player_inventory_summary.html'), 'utf8');

class PlayerStats extends View {
    constructor(options) {
        super(options);
        this.template = Handlebars.compile(player_inventory_summary_tmpl);
    }
    save_to_model() {
        return true;
    }
    render() {
        const data = {
            count: this.model.inventory.length,
            capacity: this.model.stats.strength
        };
        this.element.innerHTML = this.template(data);
    }
}

module.exports = PlayerStats;
