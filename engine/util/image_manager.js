'use strict';

var EventEmitter = require('events').EventEmitter;

class ImageManager extends EventEmitter {
    constructor() {
        super();

        this.images = {};
    }
    get(path) {
        return new Promise((resolve, reject) => {
            if (this.images.hasOwnProperty(path)) {
                resolve(this.images[path]);
            } else {
                var image = new Image();
                image.onload = () => {
                    this.images[path] = image;
                    resolve(image);
                };
                image.src = path;
            }
        });
    }
    get_multiple(paths) {
        var promises = [];

        paths.forEach((path) => {
            promises.push(this.get(path));
        });

        return Promise.all(promises);
    }
}

var manager = new ImageManager();

module.exports = manager;
