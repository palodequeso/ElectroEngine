'use strict';

var Handlebars = require('handlebars');
var App = require('./views/app.js');

Handlebars.registerHelper('times', function(n, block) {
    console.log("Times: ", n);
    var i = 0;
    var accum = '';
    for (i = 0; i < n; i += 1) {
        accum += block.fn(i);
    }
    return accum;
});

document.addEventListener("DOMContentLoaded", () => {
    var titlebar = new hx.TitleBar('.heading');
    var sidebar = new hx.Sidebar('.hx-sidebar'/*, {
        headerSelector: '.titlebar',
        contentSelector: '.content',
        autoAddSidebarClass: false
    }*/);

    var app = new App({
        element: document.querySelector('body')
    });
    app.render();
});
