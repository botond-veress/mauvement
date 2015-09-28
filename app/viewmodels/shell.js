define(['managers/navigationManager', 'text!views/templates/controls.html'],
    function (navigationManager) {

        function activate() {    
            return navigationManager.buildShellRoutes().activate({ pushState: true }); //set { pushState : true } + htaccess for no-hashes
        }

        var vm = {
            activate: activate,
            navigationManager: navigationManager
        };

        return vm;
    }
);