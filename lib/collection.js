'use strict';

var uuid = require('uuid');
var EventEmitter = require('events').EventEmitter;
var Model = require('./model.js');
var AjaxMethod = require('./ajax.js');

// TODO: Get rid of jquery...
// http://stackoverflow.com/questions/16493645/javascript-equivalent-of-jquerys-keyup-and-keydown
// http://blog.garstasio.com/you-dont-need-jquery/events/

// TODO: Lots to do in here, needs tests!
class Collection extends EventEmitter {
    get model() {
        return Model;
    }
    get url() {
        return '/';
    }
    get AjaxMethod() {
        return AjaxMethod;
    }
    get indexes() {
        return [];
    }
    constructor(model_data) {
        super();
        this.models = {};
        this.model_lookup = {};
        this.model_index_lookup = {};
        if (model_data !== undefined) {
            this.reset(model_data);
        }
    }
    serialize() {
        var out = [];
        this.each((model) => {
            out.push(model.serialize());
        });
        return out;
    }
    get length() {
        return Object.keys(this.models).length;
    }
    each(callback) {
        Object.keys(this.models).forEach((collection_id, index) => {
            callback(this.models[collection_id], collection_id, index);
        });
    }
    get(model_id) {
        if (this.models.hasOwnProperty(model_id)) {
            return this.models[model_id];
        } else if (this.model_lookup.hasOwnProperty(model_id)) {
            return this.models[this.model_lookup[model_id]];
        }

        return undefined;
    }
    fetch(callback) {
        this.AjaxMethod(this.url, "read", {}, (error, response) => {
            this.emit("fetched");
            this.reset(response);
            if (callback !== undefined) {
                callback(response);
            }
        });
    }
    reset(data) {
        this.each((model, collection_id) => {
            this.remove(model);
        });

        data.forEach((entry) => {
            this.add(entry);
        });

        this.rebuild_indexes();
        this.emit("change");
    }
    rebuild_indexes() {
        this.model_index_lookup = {};
        this.indexes.forEach((index) => {
            this.model_index_lookup[index] = {};
            this.each((model) => {
                var model_value = model[index];
                if (!this.model_index_lookup[index].hasOwnProperty(model_value)) {
                    this.model_index_lookup[index][model_value] = [];
                }

                this.model_index_lookup[index][model_value].push(model.__collection_id);
            });
        });
    }
    get_by_index(index, value) {
        if (this.model_index_lookup.hasOwnProperty(index)) {
            var model_index = this.model_index_lookup[index];
            if (model_index.hasOwnProperty(value)) {
                var lookup = model_index[value];

                var result = [];
                lookup.forEach((model_id) => {
                    var model = this.get(model_id);
                    if (model !== null) {
                        result.push(model);
                    }
                });

                if (result.length === 0) {
                    return null;
                }
                if (result.length === 1) {
                    return result[0];
                }
                return result;
            }
        }
        return null;
    }
    model_changed(model) {
        this.emit("change");
    }
    model_saved(model) {
        this.emit("change");
    }
    model_fetched(model) {
        this.emit("change");
    }
    model_deleted(model) {
        this.remove(model);
        //this.emit("change"); // Already fired in remove.
    }
    add(data) {
        var model;
        // There's probably a better way to identify objects vs models.
        // Need to find a way to check for parent most class object, and see if it's the same as Model
        if (data.constructor.name === "Object") {
            model = new this.model(data);
        } else {
            model = data;
        }

        model.__collection_id = uuid.v4();

        model.addListener("change", this.model_changed.bind(this));
        model.addListener("saved", this.model_saved.bind(this));
        model.addListener("fetched", this.model_fetched.bind(this));
        model.addListener("deleted", this.model_deleted.bind(this));
        this.models[model.__collection_id] = model;
        if (model.id !== undefined && model.id !== null) {
            this.model_lookup[model.id] = model.__collection_id;
        }
        this.rebuild_indexes();
        this.emit("add", model);
        this.emit("change");
        return model;
    }
    remove(data) {
        var model = this.models[data.__collection_id];
        model.removeListener("change", this.model_changed);
        model.removeListener("saved", this.model_saved);
        model.removeListener("fetched", this.model_fetched);
        model.removeListener("deleted", this.model_deleted);
        if (model.id !== undefined && model.id !== null) {
            delete this.model_lookup[model.id];
        }
        delete this.models[model.__collection_id];
        this.rebuild_indexes();
        this.emit("remove", data);
        this.emit("change");
    }
    comparator(left, right) {
        // TODO: Strengthen this to do alphabetical on strings.
        return left.id - right.id;
    }
    sort() {
        // this.models.sort(this.comparator);
        //
        // var index = 0;
        // this.models.forEach((model) => {
        //     this.model_lookup[model.id] = index;
        //     index += 1;
        // });
    }
}

module.exports = Collection;
