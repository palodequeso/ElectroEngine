'use strict';

var EventEmitter = require('events').EventEmitter;
var Model = require('./model.js');
var AjaxMethod = require('./ajax.js');

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
    constructor(model_data) {
        super();
        this.models = [];
        this.model_lookup = {};
        if (model_data !== undefined) {
            this.reset(model_data);
        }
    }
    serialize() {
        var out = [];
        this.models.forEach((model) => {
            out.push(model.serialize());
        });
        return out;
    }
    get(model_id) {
        if (this.model_lookup.hasOwnProperty(model_id)) {
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
        var is_changed = false;
        var ids = [];
        data.forEach((entry) => {
            var model;
            if (this.model_lookup.hasOwnProperty(entry.id)) {
                model = this.models[this.model_lookup[entry.id]];
            } else {
                model = this.add(entry);
                is_changed = true;
            }
            ids.push(entry.id.toString());
        });

        Object.keys(this.model_lookup).forEach((model_id) => {
            var model_id_string = model_id.toString();
            if (ids.indexOf(model_id_string) === -1) {
                this.remove(this.models[this.model_lookup[model_id]]);
                is_changed = true;
            }
        });

        this.emit("change");
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
        model.addListener("change", this.model_changed.bind(this));
        model.addListener("saved", this.model_saved.bind(this));
        model.addListener("fetched", this.model_fetched.bind(this));
        model.addListener("deleted", this.model_deleted.bind(this));
        this.models.push(model);
        this.model_lookup[model.id] = this.models.length - 1;
        this.emit("add", model);
        this.emit("change");
        return model;
    }
    remove(data) {
        var id = data.id;
        var model = this.models[this.model_lookup[id]];
        model.removeListener("change", this.model_changed);
        model.removeListener("saved", this.model_saved);
        model.removeListener("fetched", this.model_fetched);
        model.removeListener("deleted", this.model_deleted);
        delete this.models[this.model_lookup[id]];
        delete this.model_lookup[id];
        this.emit("remove", data);
        this.emit("change");
    }
    comparator(left, right) {
        // TODO: Strengthen this to do alphabetical on strings.
        return left.id - right.id;
    }
    sort() {
        this.models.sort(this.comparator);

        var index = 0;
        this.models.forEach((model) => {
            this.model_lookup[model.id] = index;
            index += 1;
        });
    }
}

module.exports = Collection;
