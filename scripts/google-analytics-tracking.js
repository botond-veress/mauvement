define(['analytics'], function (analytics) {
    'use strict';

    function init(id) {
        // Initialize analytics
        var params = ['create', id];
        //>>excludeStart("build", true);
        params.push({ 'cookieDomain': 'none' });
        //>>excludeEnd("build");
        analytics.apply(null, params);
    }

    function update(url) {
        if (url && url.length > 0 && url.charAt(0) !== '/') {
            url = '/' + url;
        }
        console.warn('track:', url);
        //analytics('send', 'pageview', url);

        //ga('set', {
        //    page: '/new-page',
        //    title: 'New Page'
        //});
        //ga('send', 'pageview');
    }

    return {
        init: init,
        update: update
    };
});