define([
    'sandbox!main',
    'moment'
], function (
    sandbox,
    moment
) {
    'use strict';

    /*jshint camelcase: false*/

    return function (post, pageId, pageAccessToken) {
        var // imports
            get = sandbox.object.get,
            observable = sandbox.mvvm.observable,
            observableArray = sandbox.mvvm.observableArray,
            merge = sandbox.object.merge,
            raise = sandbox.state.raise,
            // properties
            isPublished = observable(false),
            calendar,
            content = observable();

        function cancel() {
            raise('page.showing', { id: pageId });
        }

        function save() {
            sandbox.facebook.createStatus({
                pageId: pageId,
                pageAccessToken: pageAccessToken,
                message: content(),
                published: isPublished()
            }, function () {
                raise('page.showing', { id: pageId });
            });
        }

        if (post) {
            content((post.message || post.story || '').replace(/\n/g, '<br/>'));
            calendar = moment(post.updated_time).calendar();
        }

        return merge(post, {
            name: 'New Post',
            content: content,
            uniqueImpressions: get(post, 'uniqueImpressions', 0),
            calendar: calendar,
            isPublished: isPublished,
            save: save,
            cancel: cancel
        });
    };
});
