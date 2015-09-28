define(['models/common/collapsable', 'models/categories/category'],
    function (collapsable, category) {

        var model = function MoreCategory(options) {

            options = options || {};

            var self = this;

            collapsable.call(self, options);
            category.call(self, options);

        };

        return model;

    }
);