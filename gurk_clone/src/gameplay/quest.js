'use strict';

var Model = require('exo').Model;

class Quest extends Model {
    get defaults() {
        return {
            name: '',
            quest_trigger: '',
            quest_trigger_type: '',
            ending_trigger: '',
            ending_trigger_type: '',
            reward: '',
            reward_value: null,
            completed: false
        };
    }
}

module.exports = Quest;
