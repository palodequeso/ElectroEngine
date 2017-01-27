'use strict';

const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');
const View = require('exo').View;
const party_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/party.html'), 'utf8');

class Party extends View {
    get events() {
        return {
            //
        };
    }
    constructor(options) {
        super(options);
        this.template = Handlebars.compile(party_tmpl);
    }
    render() {
        this.element.innerHTML = this.template(this.model.serialize());
    }
}

module.exports = Party;
