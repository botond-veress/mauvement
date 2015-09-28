define(['helpers/configuration'],
    function (configuration) {

        var _token = null;
        var _safe = {};

        var account = {
            authenticate: function (model) {
                return dummy({});
            },
            signout: function (model) {
                return dummy({});
            }
        };

        var post = {
            getAll: function (category, page, count) {
                page = page || 0;
                count = count || 12;
                return get('/wp-json/posts', {
                    post_status: 'publish',
                    page: page + 1,
                    posts_per_page: count,
                    filter: {
                        posts_per_page: count,
                        category_name: category ? category.id || null : null
                    }
                });
                var array = [];
                if (page < 3) {
                    var tags = ['fashion', 'cooking', 'interior', 'photography'];
                    for (var index = 0; index < 10; ++index) {
                        var id = index + 1;
                        array.push({ title: 'Title # Title # Title # Title # Title # Title # Title # Title # Title # Title # Title # Title # Title # Title #' + id, image: 'content/images/post-' + id + '.jpg', tags: [tags[index % tags.length]] });
                    }
                }
                return dummy(array, false, 2000);
            },
            get: function (id) {
                return get('/wp-json/posts/' + id);
            }
        };

        var category = {
            getAll: function () {
                return get('/wp-json/taxonomies/category/terms');
            }
        };

        function dummy(data, reject, timeout) {
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

        var datacontext = {
            account: account,
            post: post,
            category: category,
            setToken: setToken,
            safe: safe
        };

        return datacontext;

        function setToken(token) {
            _token = token;
        }

        function safe(id, callback) {
            if (_safe.hasOwnProperty(id)) {
                if (typeof _safe[id].abort === 'function') {
                    _safe[id].abort();
                } else if (typeof _safe[id].reject === 'function') {
                    _safe[id].reject();
                }
            }
            _safe[id] = callback;
            return $.when(callback).always(function () {
                delete _safe[id];
            });
        }

        function get(url, model) {
            return call(url, 'GET', model);
        }

        function post(url, model) {
            return call(url, 'POST', model);
        }

        function call(url, type, model) {
            if (_token) {
                model = model || {};
                model.token = _token;
            }

            return $.ajax({
                type: type,
                url: configuration.api.url + url,
                data: model,
                dataType: 'json',
                crossDomain: true
            });
        }
    }
);