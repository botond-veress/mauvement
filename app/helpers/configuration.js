define([],
    function () {

        var api = {};
        api.url = '//mauvement.vacau.com/api';
        //>>excludeStart("build", true);
        api.url = '//mauvement.vacau.com/api';
        //>>excludeEnd("build");

        var storage = {
            key: 'mauvement'
        };

        var category = {
            max: 6
        };

        var configuration = {
            api: api,
            storage: storage,
            category: category
        };

        return configuration;
    }
);