define([],
    function () {

        ko.bindingHandlers.anchor = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var $element = $(element);
                var $anchors = $element.find('a');
                
                $anchors.bind('click', blank);

                function blank() {
                    var $item = $(this);
                    if (!$item.attr('target')) {
                        $item.attr('target', '_blank');
                    }
                }
            }
        };

        ko.bindingHandlers.social = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                $(document.body).on('click', '.social-facebook', function (event) {
                    var site = getSiteInformation.call(this);
                    var share = updateQuery('https://www.facebook.com/share.php', {
                        u: encodeURIComponent(updateQuery(site.url, site.query)),
                        title: encodeURIComponent(site.title)
                    });
                    shareUrl(share, 600, 300);
                    event.preventDefault();
                });
                $(document.body).on('click', '.social-twitter', function (event) {
                    var site = getSiteInformation.call(this);
                    var share = updateQuery('https://twitter.com/share', {
                        url: encodeURIComponent(updateQuery(site.url, site.query)),
                        text: encodeURIComponent(site.title),
                        hashtags: '#mauvement'
                    });
                    shareUrl(share, 600, 300);
                    event.preventDefault();
                });
                $(document.body).on('click', '.social-google', function (event) {
                    var site = getSiteInformation.call(this);
                    var share = updateQuery('https://plus.google.com/share', {
                        url: encodeURIComponent(updateQuery(site.url, site.query))
                    });
                    shareUrl(share, 600, 300);
                    event.preventDefault();
                });
                $(document.body).on('click', '.social-tumblr', function (event) {
                    var site = getSiteInformation.call(this);
                    var share = updateQuery('http://www.tumblr.com/share/link', {
                        url: encodeURIComponent(updateQuery(site.url, site.query)),
                        name: 'mauvement',
                        description: encodeURIComponent(site.title)
                    });
                    shareUrl(share, 600, 300);
                    event.preventDefault();
                });
                $(document.body).on('click', '.social-pinterest', function (event) {
                    var site = getSiteInformation.call(this);
                    var share = updateQuery('https://www.pinterest.com/pin/create/button/', {
                        url: encodeURIComponent(updateQuery(site.url, site.query)),
                        media: encodeURIComponent(site.media),
                        description: encodeURIComponent(site.title)
                    });
                    shareUrl(share, 600, 300);
                    event.preventDefault();
                });
                $(document.body).on('click', '.social-email', function (event) {
                    var site = getSiteInformation.call(this);
                    var share = updateQuery('mailto:', {
                        to: '',
                        subject: 'mauvement',
                        body: encodeURIComponent('Check out this blog mauvement at ' + updateQuery(site.url, site.query)) + '.'
                    });
                    shareUrl(share, 600, 300);
                    event.preventDefault();
                });

                function updateQueryStringParameter(uri, key, value) {
                    var re = new RegExp('([?|&])' + key + '=.*?(&|#|$)', 'i');
                    if (uri.match(re)) {
                        return uri.replace(re, '$1' + key + '=' + value + '$2');
                    } else {
                        var hash = '';
                        if (uri.indexOf('#') !== -1) {
                            hash = uri.replace(/.*#/, '#');
                            uri = uri.replace(/#.*/, '');
                        }
                        var separator = uri.indexOf('?') !== -1 ? '&' : '?';
                        return uri + separator + key + '=' + value + hash;
                    }
                }

                function buildQuery(object, prefix) {
                    var params = [];
                    for (var param in object) {
                        if (object.hasOwnProperty(param)) {
                            var key = prefix ? prefix + '[' + param + ']' : param;
                            var value = object[param];
                            if (value) {
                                params.push(typeof value == 'object'
                                    ? buildQuery(value, key)
                                    : key + '=' + value);
                            }
                        }
                    }
                    return params.join('&');
                }

                function updateQuery(url, query) {
                    for (var key in query) {
                        if (query.hasOwnProperty(key) && !!query[key]) {
                            url = updateQueryStringParameter(url, key, query[key]);
                        }
                    }
                    return url;
                }

                function getSiteInformation() {
                    var $this = $(this);
                    return {
                        title: $this.data('title') || document.title,
                        media: $this.data('media') || null,
                        url: $this.data('url') || window.location.href,
                        query: {
                            utm_source: $this.data('utm-source') || null,
                            utm_medium: $this.data('utm-medium') || null,
                            utm_term: $this.data('utm-term') || null,
                            utm_content: $this.data('utm-content') || null,
                            utm_name: $this.data('utm-name') || null
                        }
                    };
                }

                function shareUrl(url, width, height) {
                    var leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
                    var topPosition = (window.screen.height / 2) - ((height / 2) + 50);
                    var windowFeatures = 'status=no,height=' + height + ',width=' + width + ',resizable=yes,left=' + leftPosition + ',top=' + topPosition + ',screenX=' + leftPosition + ',screenY=' + topPosition + ',toolbar=no,menubar=no,scrollbars=no,location=no,directories=no';
                    window.open(url, 'sharer', windowFeatures);
                }
            },
        };

        ko.bindingHandlers.data = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var value = buildObject(ko.toJS(valueAccessor()), 'data');

                function buildObject(object, name, source) {
                    source = source || {};
                    for (var key in object) {
                        if (object.hasOwnProperty(key)) {
                            var nkey = name + '-' + key;
                            if (typeof object[key] === 'object') {
                                buildObject(object[key], nkey, source);
                            } else {
                                source[nkey] = object[key];
                            }
                        }
                    }
                    return source;
                }

                ko.bindingHandlers.attr.update(element, function () {
                    return value;
                }, allBindingsAccessor, viewModel, bindingContext);
            }
        }

        ko.bindingHandlers.infinite = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var value = ko.utils.unwrapObservable(valueAccessor());
                var offset = ko.utils.unwrapObservable(value.offset || 0);
                var callback = typeof value.callback === 'function' ? value.callback : noop;

                var $element = $(element);
                var $window = $(window);
                var loading = false;

                $window.on('scroll', function () {
                    if (!loading && $element.is(':visible') && !$element.data('infinity-disable')) {
                        var top = $window.scrollTop();
                        var height = $window.height();

                        var bottom = $element.offset().top + $element.height();
                        if (top + height > bottom - offset) {
                            loading = true;
                            $.when(callback()).always(function () {
                                loading = false;
                            });
                        }
                    };
                });
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var value = ko.utils.unwrapObservable(valueAccessor());
                var disable = ko.utils.unwrapObservable(value.disable);
                $(element).data('infinity-disable', !!disable);
            }
        };

        ko.bindingHandlers.preventBodyScroll = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                ko.bindingHandlers.css.update($('body').get(0), function () {
                    return { 'no-scroll': valueAccessor() };
                }, allBindingsAccessor, viewModel, bindingContext);
            }
        };

        ko.bindingHandlers.delay = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var value = ko.utils.unwrapObservable(valueAccessor());
                var factor = ko.utils.unwrapObservable(value.factor);
                var offset = ko.utils.unwrapObservable(value.offset);
                var base = ko.utils.unwrapObservable(value.base);

                $(element).css({
                    transitionDelay: (offset + factor * base) + 'ms'
                });
            }
        };

        ko.bindingHandlers.backgroundImage = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var $element = $(element);
                var value = ko.utils.unwrapObservable(valueAccessor());
                var url = ko.utils.unwrapObservable(value.url);
                var callback = value.callback || noop;

                var loaded = ko.observable(false);

                if (url) {
                    $('<img />').attr('src', url).load(function () {
                        loaded(true);
                        change(url);
                    }).error(function () {
                        change(null);
                    });
                } else {
                    change(null);
                }

                function change(url) {
                    ko.bindingHandlers.style.update(element, function () {
                        return { backgroundImage: url ? 'url(' + url + ')' : null };
                    }, allBindingsAccessor, viewModel, bindingContext);
                    ko.bindingHandlers.css.update(element, function () {
                        return { 'image-ready': loaded, 'image-missing': !url };
                    }, allBindingsAccessor, viewModel, bindingContext);
                    
                    $(this).remove();
                    setTimeout(function () {
                        callback(viewModel);
                    }, 250);
                }
            }
        };

        ko.bindingHandlers.hidden = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var hidden = !ko.unwrap(valueAccessor());
                ko.bindingHandlers.visible.update(element, function () { return hidden; }, allBindingsAccessor, viewModel, bindingContext);
            }
        };
    }
);