'use strict';

var Collection = require('exo').Collection;

var Quest = require('./quest.js');

class Quests extends Collection {
    get model() {
        return Quest;
    }
}

module.exports = Quests;
