define(['moment', 'managers/routeManager'],
    function (moment, routeManager) {

        function createPost(id, date, slug) {
            date = moment(date || Date.now());
            return encodeURI(routeManager.distinct.post.hash + '/' + id + '/' + date.format('YYYY/MM/DD') + '/' + slug);
        }

        var urlManager = {
            createPost: createPost
        };

        return urlManager;
    }
);