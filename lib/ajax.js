'use strict';

var $ = require('jquery');

function AppendUrlId(url, data) {
    if (data.hasOwnProperty('id')) {
        if (!url.endsWith('/')) {
            url += '/';
        }
        url += data.id;
    }
    return url;
}

function AjaxMethod(url, method, data, callback) {
    if (method !== "post") {
        url = AppendUrlId(url, data);
    }

    var fetch_method = {
        "create": "post",
        "read": "get",
        "update": "put",
        "delete": "delete"
    }[method];

    var options = {
        url: url,
        dataType: 'json',
        type: fetch_method,
        contentType: 'application/json',
        success: (data, text_status, jqxhr) => {
            callback(null, data);
        },
        error: (jqxhr, text_status, error_thrown) => {
            callback(error_thrown, null);
        }
    };
}

module.exports = AjaxMethod;
