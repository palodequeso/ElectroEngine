'use strict';

const Collection = require('exo').Collection;

const SaveGame = require('./save_game.js');

class SaveGames extends Collection {
    get model() {
        return SaveGame;
    }
}

module.exports = SaveGames;
