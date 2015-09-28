/**
 * Google analytics include (using "Universal Analytics")
 * https://gist.github.com/acusti/8718758
 */

/*global define */

define(function () {
    'use strict';

    var ga_amd;

    // Setup temporary Google Analytics objects
    window.GoogleAnalyticsObject = 'ga';
    window.ga = window.ga || function () {
        (window.ga.q = window.ga.q || []).push(arguments);
    };
    window.ga.l = 1 * new Date();

    // Create a function that wraps `window.ga`
    // This allows dependant modules to use `window.ga` via amd module
    ga_amd = function () {
        window.ga.apply(this, arguments);
    };

    return ga_amd;
});