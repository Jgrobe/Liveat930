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
    SP.isHoverActive = false;

    SP.init = function() {
        console.log('poster objects', SP.$object);

        // Apply HoverFX
        SP.$object.hoverTrigger.on('click', function(e) {
            e.preventDefault();
            console.log('firing hover trigger');
            var $clicked = jQuery(this);
            if(!SP.HOVERSTAT_ACTIVE) {
                var tl = new TimelineMax({onComplete:function(){SP.HOVERSTAT_ACTIVE = true;}});
                tl.add(function() {
                    open_hoverstate($clicked);
                });
                tl.to(SQSP.$objects.burger,.3, {autoAlpha:0}, 0);
                tl.add(function() {
                    SQSP.instances.FieldTracker.update({x: e.clientX, y: e.clientY});
                    SQSP.instances.FieldTracker.$object.tracker.addClass('active');
                }, 0);
            }
        });

        // remove HoverFX
        jQuery(document).on('click', '.posters.hover-on', function(e) {
            e.preventDefault();
            console.log('firing unhover trigger', e);
            if(SP.HOVERSTAT_ACTIVE) {
                var tl = new TimelineMax({onComplete:function() {SP.HOVERSTAT_ACTIVE = false;}});
                tl.add(function(){
                    close_hoverstate();
                    SQSP.instances.FieldTracker.$object.tracker.removeClass('active');
                });
                tl.to(SQSP.$objects.burger,.3, {autoAlpha:1, clearProps:'autoAlpha'}, 0);
            }// endif
        });

    };// init()

    if(SP.options.autoInit) SP.init();

    function open_hoverstate($clicked) {

        jQuery(SP.$object.hoverClassApplicants).each(function(){jQuery(this).addClass(SP.options.posterHoverClass)});
        //SP.$object.container.addClass(SP.options.posterHoverClass);
        $clicked.addClass(SP.options.elementHoverClass);

        jQuery(SP.$object.hoverFXApplicants).each(function(i, elem) {
            //console.log('--------------------------- this hover applicant', elem);
            var $thisApplicant = jQuery(this);
            $thisApplicant.css({
                'background-image' : 'url('+ $clicked.attr('data-img') +')'
            });

            if(SP.options.gradientMap) {
                console.log('applying gradient map on ', elem, SP.options.gradientMap);
                GradientMaps.applyGradientMap($thisApplicant.get(0), SP.options.gradientMap);
            }
        });
    }// open_hoverstate()

    function close_hoverstate() {
        jQuery(SP.$object.hoverClassApplicants).each(function(){jQuery(this).removeClass(SP.options.posterHoverClass)});
        SP.$object.hoverTrigger.removeClass(SP.options.elementHoverClass);
        // HOVER BG IMAGE
        jQuery(SP.$object.hoverFXApplicants).each(function(i, elem) {

            var $thisApplicant = jQuery(this);
            $thisApplicant.removeClass(SP.options.posterHoverClass).css({
                'background-image' : ''
            });
            if(SP.options.gradientMap) {
                GradientMaps.removeGradientMap($thisApplicant.get(0), SP.options.gradientMap);
            }

        });
    }// close_hoverstate()

};// ScrollPoster