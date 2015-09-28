define([],
    function () {

        var model = function Collapsable(options) {

            options = options || {};

            var self = this;

            self.opened = assignVariable(options.opened || false);
            self.open = function () {
                self.opened(true);
            };
            self.close = function () {
                self.opened(false);
            };
            self.toggle = function () {
                self.opened(!self.opened());
            };

        };

        return model;

    }
);