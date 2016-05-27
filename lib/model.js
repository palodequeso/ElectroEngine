'use strict';

var EventEmitter = require('events').EventEmitter;
var AjaxMethod = require('./ajax.js');

// TODO: Get rid of jquery...
// http://stackoverflow.com/questions/16493645/javascript-equivalent-of-jquerys-keyup-and-keydown
// http://blog.garstasio.com/you-dont-need-jquery/events/

class Model extends EventEmitter {
    get defaults() {
        return {};
    }
    constructor(data) {
        super();

        if (data === undefined) {
            data = {};
        }

        this.id = null;
        Object.assign(this, this.defaults, data);
    }
    destructor() {
        // TODO, look at View
    }
    get AjaxMethod() {
        return AjaxMethod;
    }
    sync(method, callback) {
        var data = this.serialize();
        this.AjaxMethod(this.url, method, this.serialize(), (error, response) => {
            if (method === "create" || method === "update") {
                this.set(response, false);
                this.emit("saved", this);
            } else if (method === "read") {
                this.set(response, false);
                this.emit("fetched", this);
            } else if (method === "delete") {
                this.emit("deleted", this);
            }
            if (callback !== undefined) {
                callback(response);
            }
        });
    }
    save() {
        var args = arguments;
        var callback = undefined;
        var method = this.id === null ? "create" : "update";
        if (args.length === 2 && typeof args[0] === "object" && typeof args[1] === "function") {
            this.set(args[0], false);
            callback = args[1];
        } else if (args.length === 1 && typeof args[0] === "function") {
            callback = args[0];
        } else if (args.length !== 0) {
            console.warn("Invalid arguments to Model.save", args);
            return;
        }
        this.sync(method, callback);
    }
    fetch(callback) {
        this.sync("read", callback);
    }
    delete(callback) {
        this.sync("delete", callback);
    }
    validate(data) {
        //
    }
    serialize() {
        var out = {};
        Object.keys(Object.assign({}, this.defaults, {"id": null})).forEach((key) => {
            if (key === "id" && this.id === null) {
                return;
            }

            out[key] = this[key];
            if (this[key] !== null && this[key] !== undefined && this[key].constructor.name) {
                if (this[key].constructor.name !== 'String' && this[key].constructor.name !== 'Number' &&
                    this[key].constructor.name !== 'Boolean' && this[key].constructor.name !== 'Object' &&
                    this[key].constructor.name !== 'Array') {
                    out[key] = this[key].serialize();
                }
            }
        });
        return out;
    }
    get url() {
        return '/';
    }
    get defaults() {
        return {};
    }
    // TODO: Uncomment this when function default args are supported.
    //set(data, emit_change_event=true) {
    set(data, emit_change_event) {
        if (emit_change_event === undefined) {
            emit_change_event = true;
        }
        var temp_data = Object.assign({}, this, data);
        try {
            this.validate(temp_data);
            Object.assign(this, temp_data);
            if (emit_change_event) {
                this.emit("change", this);
            }
            return true;
        } catch (exception) {
            // Trigger event instead.
            console.warn(exception);
            this.emit("invalid", exception);
            return false;
        }
    }
}

module.exports = Model;
