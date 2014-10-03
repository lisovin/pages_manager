/*jshint camelcase: false*/
define('facebook-hello', [
    'hello'
], function (
    hello
) {
    'use strict';

    function init() {
        var redirect;
        if (window.cordova) {
            redirect = {
                redirect_uri: 'http://localhost/pages_manager/redirect.html'
            };
        }
        hello.init({
            facebook: '378048859009666',
        }, redirect);
    }

    function login(onLoggedIn, onNotLoggedIn) {
        hello('facebook').login({
            scope: 'email,manage_pages,publish_actions,read_insights' ,
            display: 'popup',
            force: true,
            popup_specs: 'location=no'
        }).then(onLoggedIn, onNotLoggedIn);
    }

    function logout(onLoggedOut, onError) {
        hello('facebook').logout({ force: true }).then(onLoggedOut, onError);
    }

    function api(opts, onResult, onError) {
        var url = opts.url,
            method = opts.method,
            data = opts.data;

        hello('facebook')
            .api(url, method, data)
            .then(onResult, function (e) {
                onError(e.error);
            });
    }

    return {
        init: init,
        login: login,
        logout: logout,
        api: api
    };
});

define('facebook-fb', [
    'facebook'
], function (
    fb
) {
    'use strict';

    function init() {
        fb.init({
            appId: '378048859009666',
            version: 'v2.1'
        });
    }

    function login(onLoggedIn, onNotLoggedIn) {
        fb.login(function (response) {
            if (response.error) {
                onNotLoggedIn(response.error);
            } else {
                onLoggedIn(response);
            }
        }, { scope: 'email,manage_pages,publish_actions,read_insights' });
    }

    function logout(onLoggedOut) {
        fb.logout(onLoggedOut);
    }

    function api(opts, onResult, onError) {
        var url = opts.url,
            method = opts.method,
            data = opts.data;

        fb.api(url, method, data, function (response) {
            if (response.error) {
                onError(response.error);
            } else {
                onResult(response);
            }
        });
    }

    return {
        init: init,
        login: login,
        logout: logout,
        api: api
    };
});

define('scalejs.facebook',[
    'scalejs!core',
    'facebook-hello'
], function (
    core,
    fb
) {
    'use strict';

    var get = core.object.get,
        merge = core.object.merge;

    /*jshint camelcase: false*/
    function init() {
        fb.init();
    }

    function login(onLoggedIn, onNotLoggedIn) {
        fb.login(onLoggedIn, onNotLoggedIn);
    }

    function getPages(onPages, onError) {
        fb.api({ url: '/me/accounts' }, function (response) {
            onPages(response.data);
        }, function (e) {
            onError(e);
        });
    }

    function getPosts(url, onPosts) {
        fb.api({ url: url }, function (response) {
            console.log('posts', response);
            onPosts(response.data);
        }, function (e) {
            console.log('Failed to get posts:', e);
            onPosts([]);
        });
    }

    function getInsights(posts, onInsights) {
        var batch = {
            batch: JSON.stringify(posts.map(function (p) {
                return { method: 'GET', relative_url: p.id + '/insights/post_impressions_unique/lifetime'};
            }))
        };

        fb.api({ url: '/', method: 'POST', data: batch }, function (response) {
            console.log('insights', response);
            var insights = response.map(function (r) {
                var body = JSON.parse(r.body),
                    data,
                    values,
                    uniqueImpressions = 0;

                data = get(body, 'data', []);
                if (data.length !== 0) {
                    values = get(data[0], 'values', []);
                    if (values.length !== 0) {
                        uniqueImpressions = values[0].value;
                    }
                }

                return { uniqueImpressions: uniqueImpressions };
            });
            onInsights(insights);
        }, function (e) {
            console.log('Failed to get insights:', e);
            onInsights(posts.map(function () { return { uniqueImpressions: 0 }; }));
        });
    }

    function getPostsWithInsights(pageId, onPublishedPosts, onUnpublishedPosts, onScheduledPosts) {
        function _getPostsWithInsights(url, onPostsWithInsights) {
            getPosts(url, function (posts) {
                getInsights(posts, function (insights) {
                    var postsWithInsights = posts.zip(insights, function (p,i) { return merge(p,i); }).toArray();

                    onPostsWithInsights(postsWithInsights);
                });
            });
        }

        _getPostsWithInsights('/' + pageId + '/feed', onPublishedPosts);

        _getPostsWithInsights('/' + pageId + '/promotable_posts?limit=100', function (posts) {
            var unpublished = posts.filter(function (p) { return !p.is_published && !p.scheduled_publish_time; }),
                scheduled = posts.filter(function (p) { return p.scheduled_publish_time; });

            onUnpublishedPosts(unpublished);
            onScheduledPosts(scheduled);
        });
    }

    function createStatus(status, onCreated) {
        fb.api({
            url: '/' + status.pageId + '/feed',
            method: 'post',
            data: {
                access_token: status.pageAccessToken,
                message: status.message,
                published: status.published,
                type: 'status'
            }
        }, function (result) {
            console.log('createStatus', result);
            onCreated();
        }, function (e) {
            console.log('Failed to create status: ', e);
            alert('Failed to create status: ' + JSON.stringify(e));
            onCreated();
        });
    }

    function logout(onLoggedOut, onError) {
        fb.logout(onLoggedOut, onError);
    }

    core.registerExtension({
        facebook: {
            init: init,
            login: login,
            getPages: getPages,
            getPostsWithInsights: getPostsWithInsights,
            createStatus: createStatus,
            logout: logout
        }
    });
    /*jshint camelcase: true*/
});
