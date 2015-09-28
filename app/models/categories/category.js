define([],
    function () {

        var model = function Category(options) {

            options = options || {};

            var self = this;

            self.name = options.name || 'Unknown';
            self.id = options.id || !options.empty ? options.id || self.name.toLowerCase() : null;
            self.uid = 'category-' + (self.id || self.name.toLowerCase());
            self.active = !!options.active;
            self.hash = options.base ? options.base + (self.id ? '/' + self.id : '') : null;
            self.hits = options.hits || 0;
            self.last = options.last || null;

        };

        return model;

    }
);