'use strict';

const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');
const View = require('exo').View;

const player_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/player.html'), 'utf8');

const PlayerSummaryView = require('./player_summary.js');
const PlayerInventorySummaryView = require('./player_inventory_summary.js');
const PlayerStatsView = require('./player_stats.js');

class Player extends View {
    constructor(options) {
        super(options);
        this.template = Handlebars.compile(player_tmpl);
    }
    save_to_model() {
        //
    }
    render() {
        this.element.innerHTML = this.template({});

        console.log(this.model);
        const player_summary = new PlayerSummaryView({
            model: this.model
        });
        const player_inventory_summary = new PlayerInventorySummaryView({
            model: this.model
        });
        const player_stats = new PlayerStatsView({
            model: this.model.stats,
            class: this.model.class
        });

        player_summary.render();
        this.element.querySelector('.player_summary').appendChild(player_summary.element);
        player_inventory_summary.render();
        this.element.querySelector('.player_inventory_summary').appendChild(player_inventory_summary.element);
        player_stats.render();
        this.element.querySelector('.player_stats').appendChild(player_stats.element);

        player_summary.on('class_change', () => {
            player_stats.class = this.model.class;
            player_stats.render();
        });
    }
}

module.exports = Player;
