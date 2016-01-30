'use strict';

var $ = require('jquery');

var App = require('./views/app.js');

document.addEventListener("DOMContentLoaded", () => {
    var titlebar = new hx.TitleBar('.heading');
    var sidebar = new hx.Sidebar('.hx-sidebar');

    var app = new App({
        element: $("body")
    });
    app.render();
});
