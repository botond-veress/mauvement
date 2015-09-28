define(['models/posts/post'],
    function (post) {

        var model = function Post(options) {

            options = options || {};
            options.author = options.author || {};
            options.featured_image = options.featured_image || {};

            var self = this;

            post.call(self, options);
            self.author = options.author.nickname || options.author.name || (options.author.first_name && options.author.last_name ? options.author.first_name + ' ' + options.author.last_name : null);
            self.content = options.content || null;
            self.image = options.image || options.featured_image.source || null;

        };

        return model;

    }
);