define(['managers/navigationManager', 'managers/routeManager', 'models/common/collapsable'],
	function (navigationManager, routeManager, collapsable) {

	    var menu = new collapsable();

	    function activate() {
	        return true;
	    }

	    var vm = {
	        activate: activate,
	        navigationManager: navigationManager,
	        routeManager: routeManager,
            menu: menu
	    };

	    return vm;
	}
);