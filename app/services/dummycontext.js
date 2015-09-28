define([],
    function () {

        function mock(data, reject, timeout) {
            var defer = new $.Deferred();

            setTimeout(function () {
                if (!reject) {
                    defer.resolve(data);
                } else {
                    defer.reject(data);
                }
            }, timeout || 200);

            return defer;
        }

        var dummycontext = {
            mock: mock
        };

        return dummycontext;

    }
);