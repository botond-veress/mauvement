define(['managers/urlManager', 'models/posts/post'],
    function (urlManager, post) {

        var model = function PagePost(options) {

            options = options || {};
            options.featured_image = options.featured_image || {};

            var self = this;

            post.call(self, options);
            self.hash = urlManager.createPost(self.id, options.date, options.slug);
            self.image = options.image || options.featured_image.source || null;
            self.load = ko.observable(!self.image);
            self.draft = options.status.toLowerCase() !== 'publish';

            self.loaded = function () {
                self.load(true);
            };

        };

        return model;

    }
);