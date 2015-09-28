define(['managers/routeManager'],
	function (routeManager) {

	    function activate() {
	        return true;
	    }

	    var vm = {
	        activate: activate,
	        routeManager: routeManager
	    };

	    return vm;
	}
);