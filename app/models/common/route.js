define([],
    function () {

        var model = function Route(options) {

            options = options || {};

            var self = this;

            self.route = options.route;
            self.moduleId = options.moduleId;
            self.title = options.title;
            self.nav = options.nav;
            self.hash = options.hash || null;
            self.hidden = !!options.hidden;
            self.disabled = !!options.disabled;
            if (options.hasOwnProperty('name')) {
                self.name = options.name;
            }

        };

        return model;

    }
);