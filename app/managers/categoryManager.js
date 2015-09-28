define(['helpers/configuration', 'services/datacontext', 'services/storagecontext', 'services/dummycontext', 'managers/routeManager', 'managers/navigationManager', 'managers/postManager', 'models/categories/category', 'models/categories/more.category', 'tracking'],
    function (configuration, datacontext, storagecontext, dummycontext, routeManager, navigationManager, postManager, category, moreCategory, tracking) {

        var categories = ko.observableArray().extend({ list: true });
        categories.all = ko.observable(new category({ name: 'All', base: routeManager.distinct.blog.hash, empty: true, active: true }));
        categories.more = ko.observable(new moreCategory({ name: '...', id: 'more' }));
        categories.max = ko.observable(configuration.category.max);
        categories.list = ko.computed(function () {
            return [this.all()].concat(this().slice()).concat([this.more()]);
        }, categories).extend({ active: handleCategory });

        function getAll() {
            if (categories.empty()) {
                var recents = storagecontext.getData('category.recent');
                if (!Array.isArray(recents)) {
                    recents = [];
                }

                return datacontext.safe('categories', datacontext.category.getAll()).then(function (result) {
                    result = result || [];
                    result = result.sort(function (current, next) {
                        return current.ID - next.ID;
                    }).skip(1).map(function (current) {
                        return new category({ name: current.name, id: current.slug, base: routeManager.distinct.blog.hash })
                    }).sort(function (current, next) {
                        var ci = recents.indexOf(current.id);
                        var ni = recents.indexOf(next.id);
                        return ci >= 0 && ni >= 0
                            ? ci - ni
                            : ci >= 0
                            ? -1
                            : 1;
                    });

                    categories(result);

                    return categories;
                });
            } else {
                return dummycontext.mock(categories, false, 0);
            }
        }

        function handleCategory(category, force) {
            if (category !== categories.more()) {
                if (category !== categories.all) {
                    var recents = storagecontext.getData('category.recent');
                    if (!Array.isArray(recents)) {
                        recents = [];
                    }
                    recents.unshift(category.id);
                    storagecontext.setData('category.recent', recents.unique().take(categories.max()));
                }

                if (force) {
                    navigationManager.router.navigate(category.hash, { trigger: false });
                    tracking.update(category.hash);

                    return postManager.getAll(category);
                } else {
                    return true;
                }
            } else {
                category.toggle();
            }
        }

        function select(id) {
            var category = [categories.all()].concat(categories()).find(function (current) {
                return current.id == id;
            });
            if (category) {
                categories.list.activate.apply(null, [category].concat(Array.prototype.slice.call(arguments).skip(1)));
            }
            return category;
        }

        var categoryManager = {
            getAll: getAll,
            select: select,
            categories: categories
        };

        return categoryManager;

    }
);