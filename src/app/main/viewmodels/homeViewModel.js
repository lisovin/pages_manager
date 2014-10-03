define([
    'sandbox!main'
], function (
    sandbox
) {
    'use strict';

    return function () {
        var // imports
            observable = sandbox.mvvm.observable,
            observableArray = sandbox.mvvm.observableArray,
            raise = sandbox.state.raise,
            // properties
            title = observable('PAGES'),
            currentPage = observable(),
            pages = observableArray([]);

        function findPageById(id) {
            return pages().first(function (p) {
                return p.id === id;
            });
        }

        function logout() {
                        //var url = window.location.href;
                        //console.log('--->initial url', url);
                        //if (url.indexOf('?') > 0) {
                            //window.location.replace(url.substring(0, url.indexOf('?')));
            sandbox.facebook.logout(function () {
                raise('not.loggedin');
            }, function (e) {
                console.log('Failed to logout', e);
                alert('Failed to logout: ' + JSON.stringify(e));
            });
        }

        return {
            title: title,
            pages: pages,
            currentPage: currentPage,
            findPageById: findPageById,
            logout: logout
        };
    };
});
