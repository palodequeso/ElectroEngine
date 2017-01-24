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
        this.is_new = options.is_new || false;
        this.player_stats = null;
        this.player_summary = null;
        this.player_inventory_summary = null;
    }
    save_to_model() {
        return (
            this.player_stats.save_to_model() &&
            this.player_summary.save_to_model() &&
            this.player_inventory_summary.save_to_model()
        );
    }
    render() {
        this.element.innerHTML = this.template({});

        this.player_summary = new PlayerSummaryView({
            model: this.model
        });
        this.player_inventory_summary = new PlayerInventorySummaryView({
            model: this.model
        });
        this.player_stats = new PlayerStatsView({
            model: this.model.stats,
            class: this.model.class
        });

        this.player_summary.render();
        this.element.querySelector('.player_summary').appendChild(this.player_summary.element);
        this.player_inventory_summary.render();
        this.element.querySelector('.player_inventory_summary').appendChild(this.player_inventory_summary.element);
        this.player_stats.render();
        this.element.querySelector('.player_stats').appendChild(this.player_stats.element);

        this.player_summary.on('class_change', () => {
            this.player_stats.class = this.model.class;
            this.player_stats.render();
        });
    }
}

module.exports = Player;
