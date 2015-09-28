define(['managers/routeManager', 'managers/navigationManager', 'managers/categoryManager', 'managers/postManager', 'services/dummycontext'],
    function (routeManager, navigationManager, categoryManager, postManager, dummycontext) {

        function canActivate(category) {
            return categoryManager.getAll().then(function (result) {
                var exists = !!categoryManager.select(category);
                if (!exists) {
                    callback();
                }
                return exists;
            }, callback);

            function callback() {
                navigationManager.router.navigate(routeManager.distinct.blog.hash, { trigger: true, replace: true });
                return { message: 'Category not found.' };
            }
        }

        function activate(category) {
            postManager.getAll(categoryManager.categories.list.active());
            return true;
        }

        var vm = {
            activate: activate,
            canActivate: canActivate,
            categoryManager: categoryManager,
            postManager: postManager
        };

        return vm;
    }
);