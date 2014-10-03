define([
    'sandbox!main'
], function (
    sandbox
) {
    'use strict';

    /*jshint camelcase: false*/

    var observable = sandbox.mvvm.observable,
        observableArray = sandbox.mvvm.observableArray,
        merge = sandbox.object.merge,
        raise = sandbox.state.raise;

    return function (page) {
        var // imports
            // properties
            published = postsGroup('Published'),
            unpublished = postsGroup('Unpublished'),
            scheduled = postsGroup('Scheduled'),
            upButtonEnabled = observable(true),
            downButtonEnabled = observable(true),
            postGroups = [published, unpublished, scheduled],
            currentPostsGroup = observable(published);

        function showPage() {
            raise('page.showing', { id: page.id });
        }

        function postsGroup(name) {
            var posts = observableArray([]);

            return {
                name: name,
                posts: posts
            };
        }

        function showPages() {
            raise('pages.showing');
        }

        function showNextPage() {
            raise('page.next.showing', { id: page.id });
        }

        function showPrevPage() {
            raise('page.prev.showing', { id: page.id });
        }

        function createNewPost() {
            raise('post.creating', { pageId: page.id, pageAccessToken: page.access_token });
        }

        return merge(page,{
            showPage: showPage,
            postGroups: postGroups,
            currentPostsGroup: currentPostsGroup,
            published: published,
            unpublished: unpublished,
            scheduled: scheduled,
            upButtonEnabled: upButtonEnabled,
            downButtonEnabled: downButtonEnabled,
            showNextPage: showNextPage,
            showPrevPage: showPrevPage,
            showPages: showPages,
            createNewPost: createNewPost
        });
    };
});
