window.__build = 1;
window.__version = '0.1a+' + window.__build;

requirejs.config({
    // urlArgs: 'v=' + window.__version,
    paths: {
        'text': '../scripts/text',
        'durandal': '../scripts/durandal',
        'plugins': '../scripts/durandal/plugins',
        'transitions': '../scripts/durandal/transitions',
        'jquery': '../scripts/jquery-2.1.1',
        'knockout': '../scripts/knockout-3.3.0.debug',
        'knockout.validation': '../scripts/knockout.validation',
        'moment': '../scripts/moment',
        'async': '../scripts/async',
        'analytics': '../scripts/google-analytics',
        'tracking': '../scripts/google-analytics-tracking'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'knockout': {
            exports: 'ko'
        },
        'knockout.validation': {
            deps: ['knockout']
        },
        'helpers/bindings': {
            deps: ['knockout']
        },
        'helpers/extenders': {
            deps: ['knockout']
        },
        'moment': {
            exports: 'moment'
        },
        'analytics': {
            exports: 'ga'
        },
        'tracking': {
            deps: ['analytics']
        }
    }
});

require(['durandal/system', 'knockout'], function (system, ko) {
    window.ko = ko

    window.assignVariable = function (variable) {
        return ko.isObservable(variable)
            ? variable
            : ko.observable(variable);
    };
    window.assignArrayVariable = function (variable) {
        return ko.isObservable(variable)
            ? variable
            : ko.observableArray(variable);
    };
    window.trimWhitespace = function (variable) {
        return ko.isObservable(variable)
            ? window.trimWhitespace(variable())
            : variable.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
    };
    window.noop = system.noop;

    Array.prototype.find = function (callback, initial, convert) {
        function convert(current) {
            return current;
        }

        for (var index = 0; index < this.length; ++index) {
            if (callback(this[index], index)) {
                return convert(this[index], index);
            }
        }
        return initial || null;
    };

    Array.prototype.unique = function () {
        return this.reduce(function (uniques, item) {
            if (uniques.indexOf(item) < 0) {
                uniques.push(item);
            }
            return uniques;
        }, []);
    };

    Array.prototype.skip = function (count) {
        return this.slice(count);
    };

    Array.prototype.take = function (count) {
        return this.slice(0, count);
    };
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'tracking', 'plugins/router', 'jquery', 'knockout', 'knockout.validation', 'helpers/bindings', 'helpers/extenders', 'transitions/fade'],
   function (system, app, viewLocator, tracking) {
       //>>excludeStart("build", true);
       system.debug(true);
       //>>excludeEnd("build");

       app.title = 'mauvement';

       app.configurePlugins({
           router: true
       });

       app.start().then(function () {
           viewLocator.useConvention();

           ko.validation.init({
               errorsAsTitle: false,
               decorateElement: true,
               errorClass: 'error',
               messageTemplate: 'validation-message-template'
           });

           tracking.init('UA-67912018-1', 'auto');

           app.setRoot('viewmodels/shell', 'fade', 'application-host');
       });
   }
);
