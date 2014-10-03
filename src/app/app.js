/* global require */
require([
    'scalejs!application/main'
], function (
    app
) {
    'use strict';

     if (window.cordova) {
        document.addEventListener('deviceready', function () {
            app.run();
        }, false);
    } else {
        app.run();
    }
});

