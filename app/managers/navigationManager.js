define(['durandal/app', 'plugins/router', 'managers/routeManager', 'tracking'],
    function (app, router, routeManager, tracking) {

        var navigationManager = {
            routeManager: routeManager,
            router: router,
            buildShellRoutes: buildShellRoutes
        };

        return navigationManager;

        //#region build routes

        function buildShellRoutes() {
            setRouteVisibility(routeManager.all, true);
            return buildRoutes(router, routeManager.all, routeManager.all[0].hash);
        }

        function buildRoutes(router, mappings, initial) {
            router.reset();

            router.on('router:navigation:complete', function (instance, instruction) {
                tracking.update(instruction.fragment);
            });

            router.guardRoute = function (instance, instruction) {
                var guard = true;

                if (!routeExists(router.routes, instruction.fragment, true)) {
                    //the route exist => redirect to the current default route
                    guard = initial || mappings[0].hash;
                }

                return guard;
            };

            router.updateDocumentTitle = function (instance, instruction) {
                var title = instance.title
                    ? ko.utils.unwrapObservable(instance.title)
                    : instruction.config.hasOwnProperty('name')
                    ? ko.utils.unwrapObservable(instruction.config.name)
                    : ko.utils.unwrapObservable(instruction.config.title);
                title = title
                    ? app.title
                        ? title + ' - ' + app.title
                        : title
                    : app.title;
                document.title = title.toLowerCase();
            };

            router
                .map(mappings)
                .mapUnknownRoutes(function (instruction) {
                    console.error('Unknown route: ', instruction);
                })
                .buildNavigationModel();

            router.visibleNavigationModel = router.visibleNavigationModel || ko.computed(function () {
                return router.navigationModel().filter(function (current) {
                    return !current.hidden;
                });
            });

            return router;
        }

        //#endregion

        //#region internal

        function routeExists(array, route, ignoreVisibility) {
            return !!routeFind(array, route, ignoreVisibility);
        }

        function routeFind(array, route, ignoreVisibility) {
            return array.find(function (current) {
                if (current.routePattern || (ignoreVisibility || current.nav)) {
                    var pattern = new RegExp(current.routePattern);
                    if (pattern.test(route)) {
                        return true;
                    }
                }
                return false;
            });
        }

        function setRouteVisibility(routes, visibility) {
            routes.forEach(function (current) {
                current.nav = visibility;
            });
        }

        //#endregion
    });