/*
 * DEPENDENCIES
 * jquery
 * lodash
 *
 * */
var GradientMapper = function($container, options) {
    if(typeof $container === 'undefined') return;
    if(typeof options === 'undefined') options = {};
    var GM = this;
    GM.options = jQuery.extend({
        autoInit: true,
        gradientMaps: ['red blue']
    }, options);
    GM.$object = {
        container : $container
    };

    if(GM.options.autoInit) GM.init();

    GM.init = function() {

        if(GM.options.gradientMaps.length > )

    };// init()
};// GradientMapper()