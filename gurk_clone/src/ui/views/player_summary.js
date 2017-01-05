'use strict';

const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');

const View = require('exo').View;

const player_summary_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/player_summary.html'), 'utf8');

class PlayerSummary extends View {
    constructor(options) {
        super(options);
        this.template = Handlebars.compile(player_summary_tmpl);
    }
    render() {
        this.element.innerHTML = this.template(this.model.serialize());
    }
}

module.exports = PlayerSummary;
