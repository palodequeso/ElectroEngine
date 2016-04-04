"use strict";

class Timer {
    constructor() {
        this.stop_time = 0;
        this.start_time = 0;
        console.log("Constructor: ", this.start_time, this.stop_time);
    }
    start() {
        this.stop_time = 0;
        this.start_time = Date.now();
        console.log("start: ", this.start_time, this.stop_time);
    }
    stop() {
        this.stop_time = Date.now();
        if (this.start_time === 0) {
            this.stop_time = 0;
        }
        console.log("stop: ", this.start_time, this.stop_time);
    }
    milliseconds() {
        var stop = this.stop_time;
        if (stop === 0 && this.start_time !== 0) {
            stop = Date.now();
        }
        return stop - this.start_time;
    }
}

module.exports = Timer;
