define(['moment'],
    function (moment) {

        var model = function Post(options) {

            options = options || {};

            var self = this;

            self.id = options.id || options.ID || null;
            self.title = options.title || 'Untitled';
            self.hash = options.hash || null;
            self.date = {
                time: moment(options.date || Date.now()).toDate()
            };
            self.date.published = moment(self.time).format('MMMM Do, YYYY');

            //urlManager.createPost(self.id, options.date, options.slug);

        };

        return model;

    }
);