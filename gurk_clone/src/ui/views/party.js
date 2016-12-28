'use strict';

var fs = require('fs');
var path = require('path');

var Handlebars = require('handlebars');
var View = require('exo').View;
var party_tmpl = fs.readFileSync(path.join(__dirname, '/../tmpl/party.html'), 'utf8');

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
