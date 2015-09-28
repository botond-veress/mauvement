define(['models/common/route'],
    function (route) {

        var routes = {
            blog: new route({ route: ['', 'blog(/:category)'], hash: '/blog', moduleId: 'viewmodels/blog', title: 'Blog', name: null, nav: true, hidden: true }),
            post: new route({ route: 'post/:id*slug', hash: '/post', moduleId: 'viewmodels/post', title: 'Post', nav: true, hidden: true }),
            archive: new route({ route: 'archive', moduleId: 'viewmodels/archive', nav: true }),
            about: new route({ route: 'about', moduleId: 'viewmodels/about', nav: true }),
            contact: new route({ route: 'contact', moduleId: 'viewmodels/contact', nav: true }),
        };

        var all = Object.keys(routes).map(function (key) {
            return routes[key];
        }).slice();

        var routeManager = {
            distinct: routes,
            all: all
        };

        return routeManager;
    }
);