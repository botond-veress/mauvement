define(['services/datacontext', 'managers/routeManager', 'managers/navigationManager', 'managers/postManager', 'managers/urlManager', 'models/common/collapsable'],
	function (datacontext, routeManager, navigationManager, postManager, urlManager, collapsable) {

	    var title = ko.computed(function () {
	        var post = postManager.post();
	        return post
                ? ko.utils.unwrapObservable(post.title)
                : 'Post';
	    });
	    var social = new collapsable();

	    function canDeactivate() {
	        console.log('asd');
	        return false;
	    }

	    function canActivate(id) {
	        return postManager.get(+id).then(function (result) {
	            return true;
	        }, callback);

	        function callback() {
	            navigationManager.router.navigate(routeManager.distinct.blog.hash, { trigger: true, replace: true });
	            return { message: 'Post not found.' };
	        }

	        return true;
	    }

	    function activate(id) {
	        return true;
	    }

	    var vm = {
	        activate: activate,
	        canActivate: canActivate,
	        canDeactivate: canDeactivate,
	        title: title,
	        social: social,
	        navigationManager: navigationManager,
	        postManager: postManager
	    };

	    return vm;

	}
);