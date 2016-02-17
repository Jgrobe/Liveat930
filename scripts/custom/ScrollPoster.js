/*
*
* Depending on:
* jquery-2.1.0.min.js
* underscore-min.js
* TweenMax.min.js
*
* */
var ScrollPoster = function($container, options) {
    if(typeof $container === 'undefined') return;
    var SP = this;
    SP.options = {
        autoInit : true,
        scrollModel: false,
        copyLayerSelector: '.copy-layer',
        hoverLayerSelector: '.hover-layer',
        hoverTriggerSelector : '.hover-trigger',
        unhoverTriggerSelector : '.hover-trigger',
        hoverApplicantSelector: '.hover-applicant',
        posterHoverClass: 'hover-on',
        elementHoverClass: 'hovered'
    };
    if(typeof options !== 'undefined') jQuery.extend(SP.options, options);
    SP.$object = {
        container: $container,
        hoverTrigger: $container.find(SP.options.hoverTriggerSelector),
        unhoverTrigger: $container.find(SP.options.unhoverTriggerSelector),
        hoverApplicants: $container.find(SP.options.hoverApplicantSelector),
        copyLayer: $container.find(SP.options.copyLayerSelector),
        hoverLayer: $container.find(SP.options.hoverLayerSelector)
    };

    SP.init = function() {
        //console.log('poster objects', SP.$object);

        // HOVER LISTENERS
        SP.$object.hoverTrigger.on('mouseenter', function(e) {
            var $hovered = jQuery(this);
            if(is_mobile()) return false;
            //if(typeof SP.unHoverIntent !== 'undefined') clearTimeout(SP.hoverIntent);
            //SP.hoverIntent = setTimeout(function() {
                //console.log('SP.$object.hoverLayer.attr', $hovered.attr('data-img'));
                //$hovered.siblings().addClass(SP.options.siblingsHoverClass);

            SP.$object.container.addClass(SP.options.posterHoverClass);
            $hovered.addClass(SP.options.elementHoverClass);

                // HOVER BG IMAGE
                //var hoverIMG = new Image();
                //
                //hoverIMG.onload = function() {
                    jQuery(SP.$object.hoverApplicants).each(function(i, elem) {
                        //console.log('--------------------------- this hover applicant', elem);
                        jQuery(elem).css({
                            'background-image' : 'url('+ $hovered.attr('data-img') +')'
                        }).addClass(SP.options.posterHoverClass);
                    });
                //};// img load
                //hoverIMG.src = $hovered.attr('data-img');
                // ITEMS FADE
            //}, 300);
        });
        SP.$object.unhoverTrigger.on('mouseleave', function(e) {
            var $unhovered = jQuery(this);
            if(is_mobile()) return false;
            //if(typeof SP.hoverIntent !== 'undefined') clearTimeout(SP.hoverIntent);
            //SP.unHoverIntent = setTimeout(function() {
                // ITEMS FADE
                SP.$object.container.removeClass(SP.options.posterHoverClass);
                $unhovered.removeClass(SP.options.elementHoverClass);
                // HOVER BG IMAGE
                jQuery(SP.$object.hoverApplicants).each(function(i, elem) {
                    jQuery(elem).removeClass(SP.options.posterHoverClass).css({
                        'background-image' : ''
                    });
                });
            //}, 300);
        });
    };// init()

    if(SP.options.autoInit) SP.init();

};// ScrollPoster