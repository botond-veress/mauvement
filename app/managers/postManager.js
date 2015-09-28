define(['helpers/configuration', 'services/datacontext', 'services/dummycontext', 'models/posts/page.post', 'models/posts/detail.post'],
    function (configuration, datacontext, dummycontext, pagePost, detailPost) {

        function page(options) {

            options = options || [];

            var self = this;

            self.parent = assignArrayVariable(options.parent);
            self.posts = assignArrayVariable(options.posts || []);
            self.posts.ready = ko.observable(false).extend({ throttle: 100 });
            self.posts.loading = ko.pureComputed(function () {
                var position = self.parent().indexOf(self);
                return !self.posts.ready() || self.parent().some(function (current, index) {
                    return index < position && !current.posts.ready();
                });
            });

            self.posts.ready(true);
        }

        var pages = ko.observableArray().extend({ list: true });
        pages.category = ko.observable(null);
        pages.loading = ko.observable(true);
        pages.end = ko.observable(false);
        pages.disabled = ko.pureComputed(function () {
            return this.loading() || this.end();
        }, pages);
        pages.ready = ko.pureComputed(function () {
            return this.end() || this().some(function (current) {
                return !current.posts.loading();
            });
        }, pages);
        pages.message = ko.pureComputed(function () {
            return this.end() && (this.empty() || this().reduce(function (count, current) {;
                return count + current.posts().length;
            }, 0)) === 0;
        }, pages);

        var post = ko.observable();
        post.next = ko.pureComputed(function () {
            var selected = null;
            if (this()) {
                var id = this().id;
                pages().forEach(function (page, index) {
                    var index = page.posts.find(function (current) {
                        return current.id === id;
                    }, null, function (current, index) {
                        return index;
                    });

                    console.warn('INDEX:', index);
                });
            }
            return selected;
        }, post);

        function loadPosts(category, index) {
            index = isNaN(index) ? 0 : index;
            pages.loading(true);
            pages.end(false);
            return datacontext.safe('posts', datacontext.post.getAll(category, index)).then(function (result, status, xhr) {
                var items = result.map(function (current) {
                    return new pagePost(current);
                });
                pages.end(items.length === 0 || +xhr.getResponseHeader('X-WP-TotalPages') <= Math.max(index, 1));
                return new page({
                    posts: items,
                    parent: pages
                });
            }, function () {
                pages.end(true);
            }).always(function () {
                pages.loading(false);
            });
        }

        function getNext() {
            return loadPosts(pages.category(), pages().length).then(function (result) {
                pages.push(result);
            });
        }

        function getAll(category) {
            if (pages.category() !== category) {
                pages([]);
                pages.category(category);
                return loadPosts(category).then(function (result) {
                    pages([result]);
                    return pages();
                });
            } else {
                return dummycontext.mock(pages(), false, 0);
            }
        }

        function get(id) {
            return getAll(pages.category()).then(function () {
                return datacontext.post.get(id).then(function (result) {
                    post(new detailPost(result));
                    return post();
                });
            });
        }

        var postManager = {
            getAll: getAll,
            getNext: getNext,
            get: get,
            pages: pages,
            post: post
        };

        return postManager;

    }
);