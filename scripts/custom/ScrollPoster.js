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
        elementHoverClass: 'hovered',
        gradientMap: false
    };
    if(typeof options !== 'undefined') jQuery.extend(SP.options, options);
    SP.$object = {
        container: $container,
        hoverTrigger: $container.find(SP.options.hoverTriggerSelector),
        unhoverTrigger: $container.find(SP.options.unhoverTriggerSelector),
        copyLayer: $container.find(SP.options.copyLayerSelector),
        hoverLayer: $container.find(SP.options.hoverLayerSelector),
        hoverClassApplicants : [$container, $container.find(SP.options.hoverLayerSelector)],
        hoverFXApplicants: $container.find(SP.options.hoverApplicantSelector)
    };

    SP.init = function() {
        //console.log('poster objects', SP.$object);

        // HOVER LISTENERS
        //SP.$object.hoverTrigger.on('mouseenter', function(e) {
        //    var $hovered = jQuery(this);
        //    if(is_mobile()) return false;
        //    //if(typeof SP.unHoverIntent !== 'undefined') clearTimeout(SP.hoverIntent);
        //    //SP.hoverIntent = setTimeout(function() {
        //        //console.log('SP.$object.hoverLayer.attr', $hovered.attr('data-img'));
        //        //$hovered.siblings().addClass(SP.options.siblingsHoverClass);
        //
        //    SP.$object.container.addClass(SP.options.posterHoverClass);
        //    $hovered.addClass(SP.options.elementHoverClass);
        //
        //        // HOVER BG IMAGE
        //        //var hoverIMG = new Image();
        //        //
        //        //hoverIMG.onload = function() {
        //            jQuery(SP.$object.hoverFXApplicants).each(function(i, elem) {
        //                //console.log('--------------------------- this hover applicant', elem);
        //                jQuery(elem).css({
        //                    'background-image' : 'url('+ $hovered.attr('data-img') +')'
        //                }).addClass(SP.options.posterHoverClass);
        //            });
        //        //};// img load
        //        //hoverIMG.src = $hovered.attr('data-img');
        //        // ITEMS FADE
        //    //}, 300);
        //});
        //SP.$object.unhoverTrigger.on('mouseleave', function(e) {
        //    var $unhovered = jQuery(this);
        //    if(is_mobile()) return false;
        //    //if(typeof SP.hoverIntent !== 'undefined') clearTimeout(SP.hoverIntent);
        //    //SP.unHoverIntent = setTimeout(function() {
        //        // ITEMS FADE
        //        SP.$object.container.removeClass(SP.options.posterHoverClass);
        //        $unhovered.removeClass(SP.options.elementHoverClass);
        //        // HOVER BG IMAGE
        //        jQuery(SP.$object.hoverFXApplicants).each(function(i, elem) {
        //            jQuery(elem).removeClass(SP.options.posterHoverClass).css({
        //                'background-image' : ''
        //            });
        //        });
        //    //}, 300);
        //});

        jQuery(document).on('click', '.artist', function(e) {
            e.preventDefault();
            var $clicked = jQuery(this);
            if(!SP.HOVERSTAT_ACTIVE) {
                open_hoverstate($clicked);
                TweenMax.to(SQSP.$objects.burger,.3, {autoAlpha:0});
                SQSP.instances.FieldTracker.update({x: e.clientX, y: e.clientY});
                SQSP.instances.FieldTracker.$object.tracker.addClass('active');
            }
        });

        jQuery(document).on('click', '.posters.hover-on', function(e) {
            e.preventDefault();
            console.log('clicked', e);
            if(SP.HOVERSTAT_ACTIVE) {
                close_hoverstate();
                SQSP.instances.FieldTracker.$object.tracker.removeClass('active');
                TweenMax.to(SQSP.$objects.burger,.3, {autoAlpha:1, clearProps:'autoAlpha'});
            }// endif
        });

        //jQuery(document).on('click', function(e){
        //    console.log('clicked', e);
        //    var $clicked = jQuery(e.target);
        //    console.log('close hoverstate?', $clicked, $clicked.hasClass('artist'));
        //    if(SP.HOVERSTAT_ACTIVE) {
        //        e.preventDefault();
        //        close_hoverstate();
        //        SQSP.instances.FieldTracker.$object.tracker.removeClass('active');
        //        TweenMax.to(SQSP.$objects.burger,.3, {autoAlpha:1, clearProps:'autoAlpha'});
        //    } else {
        //        if($clicked.hasClass('artist') || $clicked.parent().hasClass('artist')) {
        //            e.preventDefault();
        //            open_hoverstate($clicked);
        //            TweenMax.to(SQSP.$objects.burger,.3, {autoAlpha:0});
        //            SQSP.instances.FieldTracker.update({x: e.clientX, y: e.clientY});
        //            SQSP.instances.FieldTracker.$object.tracker.addClass('active');
        //        }
        //    }
        //});
        // artist click listener
        //SP.$object.hoverTrigger.on('click', function(e) {
        //    e.preventDefault();
        //    var $clicked = jQuery(this);
        //    console.log('open hoverstate?', SP.HOVERSTAT_ACTIVE);
        //    if(!SP.HOVERSTAT_ACTIVE) open_hoverstate($clicked);
        //
        //});
    };// init()

    function open_hoverstate($clicked) {

        jQuery(SP.$object.hoverClassApplicants).each(function(){addClass(SP.options.posterHoverClass)});
        //SP.$object.container.addClass(SP.options.posterHoverClass);
        $clicked.addClass(SP.options.elementHoverClass);

        jQuery(SP.$object.hoverFXApplicants).each(function(i, elem) {
            //console.log('--------------------------- this hover applicant', elem);
            var $thisApplicant = jQuery(this);
            $thisApplicant.css({
                'background-image' : 'url('+ $clicked.attr('data-img') +')'
            }).addClass(SP.options.posterHoverClass);

            if(SP.options.gradientMap) {
                var gradmap = GradientMaps.applyGradientMap($thisApplicant.get(0), SP.options.gradientMap);
                console.log('gradient map' ,gradmap);
            }
        });
        SP.HOVERSTAT_ACTIVE = true;
    }// open_hoverstate

    function close_hoverstate() {
        jQuery(SP.$object.hoverClassApplicants).each(function(){removeClass(SP.options.posterHoverClass)});
        SP.$object.hoverTrigger.removeClass(SP.options.elementHoverClass);
        // HOVER BG IMAGE
        jQuery(SP.$object.hoverFXApplicants).each(function(i, elem) {

            var $thisApplicant = jQuery(this);
            if(SP.options.gradientMap) {
                GradientMaps.removeGradientMap($thisApplicant.get(0), SP.options.gradientMap);
            }

            //$thisApplicant.removeClass(SP.options.posterHoverClass).css({
            //    'background-image' : ''
            //});
        });
        SP.HOVERSTAT_ACTIVE = false;
    }

    if(SP.options.autoInit) SP.init();

};// ScrollPoster