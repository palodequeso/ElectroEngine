'use strict';

const Collection = require('exo').Collection;

const SaveGame = reuqire('./save_game.js');

class SaveGames extends Collection {
    get model() {
        return SaveGame;
    }
}

module.exports = SaveGames;
