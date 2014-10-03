define([ 'sandbox!main',
    'app/main/viewmodels/homeViewModel',
    'app/main/viewmodels/pageViewModel',
    'app/main/viewmodels/postViewModel',
    'views!login,home,page,post',
    'bindings!main'
    //'styles!main'
], function (
    sandbox,
    homeViewModel,
    pageViewModel,
    postViewModel
) {
    'use strict';

    /*jshint camelcase: false*/

    return function mainModule() {
        var get = sandbox.object.get,
            merge = sandbox.object.merge,
            root = sandbox.mvvm.root,
            template = sandbox.mvvm.template,
            registerStates = sandbox.state.registerStates,
            state = sandbox.state.builder.state,
            parallel = sandbox.state.builder.parallel,
            onEntry = sandbox.state.builder.onEntry,
            onExit = sandbox.state.builder.onExit,
            raise = sandbox.state.raise,
            goto = sandbox.state.builder.goto,
            on = sandbox.state.builder.on,
            enumerable = sandbox.linq.enumerable,
            init = sandbox.facebook.init,
            login = sandbox.facebook.login,
            getPages = sandbox.facebook.getPages,
            getPostsWithInsights = sandbox.facebook.getPostsWithInsights;

        function onLoggedIn(response) {
            console.log('onLoggedIn: ', response);
            raise('loggedin');
        }

        function onNotLoggedIn(response) {
            console.log('onNotLoggedIn: ', response);
            raise('not.logggedin');

        }

        function loadPages(pages) {
            getPages(function (newPages) {
                console.log('pages: ', newPages);
                pages(newPages.map(pageViewModel));
                if (pages().length > 0) {
                    pages().first().upButtonEnabled(false);
                    pages().last().downButtonEnabled(false);
                }
                raise('home.loaded');
            }, function (e) {
                console.log('Failed to load pages', e);
                if (e.type === 'OAuthException') {
                    raise('not.loggedin');
                } else {
                    alert('Failed to load pages: ' + JSON.stringify(e));
                }
            });
        }

        function onPosts(postsGroup) {
            return function (posts) {
                postsGroup.posts(posts.map(postViewModel));
            };
        }

        function loadPosts(page) {
            getPostsWithInsights(page.id, onPosts(page.published), onPosts(page.unpublished), onPosts(page.scheduled));
        }

        registerStates('root',
            state('app',
                state('init',
                    onEntry(function () {
                        init();
                        //login(onLoggedIn, onNotLoggedIn);
                    }),
                    goto('home')),
                state('login',
                    onEntry(function () {
                        root(template('login_template', {
                            login: function () {
                                login(onLoggedIn, onNotLoggedIn);
                            }}));
                    }),
                    on('loggedin', goto('home'))),
                state('home',
                    state('home.init',
                        on(function () {
                            return this.home;
                        }, goto('home.loaded')),
                        goto('home.loading')),
                    state('home.loading',
                        onEntry(function () {
                            this.home = homeViewModel();
                            loadPages(this.home.pages);
                        }),
                        on('home.loaded', goto('home.loaded'))),
                    state('home.loaded',
                         onEntry(function () {
                            root(template('home_template', this.home));
                         })),
                    on('not.loggedin', goto('login', function () {
                        delete this.home;
                    })),
                    on('page.showing', goto('page'))),
                state('page',
                     onEntry(function (evt) {
                        var page = this.home.findPageById(evt.data.id);
                        loadPosts(page);

                        root(template('page_template', page));
                     }),
                     on('page.showing', goto('page')),
                     on('pages.showing', goto('home')),
                     on('page.prev.showing', goto(function (evt) {
                         var prevPage = this.home.pages().takeWhile(function (p) {
                            return p.id !== evt.data.id;
                         }).lastOrDefault(null);

                         if (prevPage !== null) {
                             raise('page.showing', { id: prevPage.id  });
                         }
                     })),
                     on('page.next.showing', goto(function (evt) {
                         var nextPage = this.home.pages().skipWhile(function (p) {
                            return p.id !== evt.data.id;
                         }).skip(1).firstOrDefault(null);

                         if (nextPage !== null) {
                             raise('page.showing', { id: nextPage.id  });
                         }
                     })),
                     on('post.creating', goto('post'))),
                state('post',
                    onEntry(function (evt) {
                        var post = postViewModel(null, evt.data.pageId, evt.data.pageAccessToken);
                        root(template('post_template', post));
                    }),
                    on('page.showing', goto('page')))));
    };
});
