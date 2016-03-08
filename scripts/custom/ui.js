init_sqsp();

function init_sqsp() {
    //console.log('----------------------- init sqsp');

    populate_namespaces();

    // set window listeners
    SQSP.$objects.window.load(function() {
        //console.log('WINDOW LOADED');

        for(var i=0; i<SQSP.functions.windowLoad.length; i++) {
            if(_.isFunction(SQSP.functions.windowLoad[i])) SQSP.functions.windowLoad[i]();
        }

        SQSP.$objects.window.trigger('resize');
        SQSP.$objects.window.trigger('scroll');

        windowloaded();

    }).resize(function() {
        //console.log('WINDOW RESIZED');
        SQSP._IS_MOBILE = is_mobile();

        for(var i=0; i<SQSP.functions.windowResize.length; i++) {
            //console.log('window resize fn:', SQSP.functions.windowResize[i]);
            if(_.isFunction(SQSP.functions.windowResize[i])) SQSP.functions.windowResize[i]();
        }

    });

    //sizeVideosOnReady();

    //SQSP.functions.createPageHero();
    SQSP.functions.createPageGallery();

    //manual video loop

    SQSP.vars.keepCheckingVideos = true;
    SQSP.vars.loopvids = [];

    jQuery('video').each(function(i,elem) {
        var vid = this;
        var $thisVid = jQuery(vid);

        vid.addEventListener('loadeddata', function() {
            //console.log('-------------------------------------- video loaded');
            size_video();
            scrollMonitor.recalculateLocations();// needed on homepage so first video in viewport starts playing on load
        });
        if($thisVid.hasClass('loop')) {
            SQSP.vars.loopvids.push(vid);
            //vid.addEventListener('ended', function(e) {
            //    console.log('video loop!');
            //    e.target.play();
            //});
        }// endif
    });

    console.log('SQSP.vars.loopvids.length', SQSP.vars.loopvids.length);
    checkVideoloop();

}// init_page()

function checkVideoloop() {
    if(!SQSP.vars.keepCheckingVideos || SQSP.vars.loopvids.length <= 0) return false;

    for(var i=0; i<SQSP.vars.loopvids.length; i++) {
        var vid = SQSP.vars.loopvids[i];
        //console.log('checking vid', vid.currentTime, vid.duration);
        if(vid.currentTime > (vid.duration-.25)) {
            //console.log('reset video time');
            vid.currentTime = 0;
            if(!vid.playing) vid.play();
        }
    }// endfor

    requestAnimationFrame( checkVideoloop );
}// checkVideoloop()

function populate_namespaces() {

    SQSP.$objects.window = jQuery(window);
    SQSP.$objects.document = jQuery(document);
    SQSP.$objects.staticHeader = jQuery('.static-header');
    SQSP.$objects.stickyHeader = jQuery('.sticky-header');
    SQSP.$objects.homeLink = SQSP.$objects.stickyHeader.find('.logo');
    SQSP.$objects.burger = SQSP.$objects.stickyHeader.find('.burger');

    var stickyOpts = {
        disable: true,
        minY: {target:jQuery('.header-marker')},
        customOperation: handleStickyBurger
    };// stickyOpts
    //console.log('stickyOpts', stickyOpts);
    SQSP.instances.stickyHeader = new ScrollHeader(SQSP.$objects.burger, stickyOpts);

    SQSP.functions.windowResize = SQSP.functions.windowResize.concat( [size_video] );

    // create Parallaxers
    handleParallax();

    // individual page init function may require namespaces -> must fire after namespaces are populated
    // individual page init function may add to namespaces -> must fire before window load & resize
    if(_.isFunction(SQSP.functions.initPage)) SQSP.functions.initPage();

    SQSP.$objects.landingBG = jQuery('.landing-bg');
    SQSP.$objects.landingVideo = SQSP.$objects.landingBG.find('video').get(0);

    jQuery(window).scroll(function(e) {
        //console.log('e', e, 'scrolltop', jQuery(window).scrollTop());
        //
        //console.log('video time', SQSP.$objects.landingVideo.currentTime);

        if(elem_exists(SQSP.$objects.landingBG)) {
            SQSP.$objects.landingBG.css({
                top : jQuery(window).scrollTop()
            });

            if(elem_exists(jQuery(SQSP.$objects.landingVideo))) {
                if(jQuery(window).scrollTop() > SQSP.$objects.landingBG.height()) {
                    if(!SQSP.$objects.landingVideo.paused) SQSP.$objects.landingVideo.pause();
                } else {
                    if(SQSP.$objects.landingVideo.paused || SQSP.$objects.landingVideo.ended) SQSP.$objects.landingVideo.play();
                }
            }// endif landing-video exists
        }// endif landing-bg exists
    });

    SQSP.instances.SEARCH = new AjaxSearch();

}// populate_namespaces()

//function sizeVideosOnReady() {
//    var $vids = jQuery('video');
//    $vids.hide();
//    $vids.each(function() {
//        var $thisVid = jQuery(this);
//        var video = $thisVid.get(0);
//        video.addEventListener('loadeddata', function () {
//            size_video();
//            $thisVid.show();
//        });
//    });
//}

function clearSearchField($field) {
    var $search = $field.parents('.search');
    $search.find('.search-field').val('');
    $search.toggleClass('on');
}

function windowloaded() {

    // FADE IN BODY ON PAGE LOAD
    if(!elem_exists(jQuery('#preloader'))) {
        //console.log('PLAIN REVEAL');
        TweenMax.to(jQuery('body'),.5, {autoAlpha:1, onComplete:function() {
            jQuery('body').removeClass('hidden');
        }});
    }// endif

    // SEARCH FIELD ENABLE/DISABLE
    SQSP.$objects.staticHeader.find('.search-icon').click(function() {
        jQuery(this).parents('.search').toggleClass('on');
    });// search click
    SQSP.$objects.staticHeader.find('.clear-icon').click(function() {
        clearSearchField(jQuery(this));
    });// search click
    SQSP.$objects.stickyHeader.find('.clear-icon').click(function() {
        clearSearchField(jQuery(this));
        if(SQSP.vars.isSearchOverlayOpen) toggleSearchOverlay();
    });// search click

    // SEARCH FIELD FUNCTIONALITY
    SQSP.$objects.searchResultsContainer = jQuery('.nav-overlay .results-wrapper');
    SQSP.instances.SEARCH.options.onSuccess = function(query, ajaxHTML, formattedResults) {
        console.log('search done: ', formattedResults);

        removeDisablerDummy();

        SQSP.$objects.searchResultsContainer.find('.result:not(.placeholder)').remove();

        jQuery('#num_results').html(formattedResults.length);
        jQuery('#search_query').html(query);

        var $resultModel = SQSP.$objects.searchResultsContainer.find('.result.placeholder');
        for(var i=0; i<formattedResults.length; i++) {

            var $newResult = $resultModel.clone().removeClass('placeholder');

            $newResult.find('.result-link').attr({
                href : formattedResults[i].href
            });
            $newResult.find('.hover-container').css({
                'background-image' : 'url('+ formattedResults[i].img +')'
            });
            $newResult.find('.result-title').html(formattedResults[i].title);
            $newResult.find('.result-num').html(prefix_int(i+1));

            SQSP.$objects.searchResultsContainer.append($newResult);

        }//endfor

        TweenMax.to('body',.4, {autoAlpha:1, clearProps:'autoAlpha'});

        if(!SQSP.vars.isSearchOverlayOpen) toggleSearchOverlay();

    };// search onSuccess()

    SQSP.$objects.searchFields = jQuery('.search-field');
    console.log('SQSP.$objects.searchFields', SQSP.$objects.searchFields);
    SQSP.$objects.searchFields.on('focus', function(e) {
        console.log('--- field has focus');
        var $field = jQuery(this);
        SQSP.vars.focusOnSearch = $field;
    }).on('focusout', function(e) {
        console.log('--- field has lost focus');
        SQSP.vars.focusOnSearch = false;
    });
    SQSP.$objects.window.on('keyup', function(e) {
        switch(e.keyCode) {
            case 13 :// enter
                if(SQSP.vars.focusOnSearch) {
                    var query = SQSP.vars.focusOnSearch.val();
                    if(query.trim() == '') return false;

                    createDisablerDummy();

                    if(!SQSP.$objects.stickyHeader.hasClass('on')) {
                        toggleNavOverlay();
                    };
                    SQSP.instances.SEARCH.search(query);
                }
                break;
        }// endswitch()
    });


    SQSP.$objects.burger.click(function() {

        if(SQSP.vars.isSearchOverlayOpen) {
            toggleSearchOverlay();
            //return false;
        }
        toggleNavOverlay();
    });// click()

    cta_hovers();

}// windowloaded

function toggleNavOverlay() {
    SQSP.$objects.stickyHeader.toggleClass('on');
    var $overlay = SQSP.$objects.stickyHeader.find('.nav-overlay');
    var $items = SQSP.$objects.stickyHeader.find('.stagger-item');
    TweenMax.killTweensOf($overlay);
    TweenMax.killTweensOf($items);
    var tl = new TimelineMax();
    if(SQSP.$objects.stickyHeader.hasClass('on')) {
        // open overlay
        tl.add(function() {
            SQSP.$objects.stickyHeader.find('video').get(0).play();
        });
        tl.to($overlay, .2, {autoAlpha:1});
        tl.staggerTo($items,.2, {autoAlpha:1},.04, '-=.075');
    } else {
        // close overlay
        tl.staggerTo($items,.2, {autoAlpha:0, clearProps:'all'},-.04);
        tl.to($overlay,.2, {autoAlpha:0, clearProps:'all'}, '-=.3');
        tl.add(function() {
            SQSP.$objects.stickyHeader.find('video').get(0).pause();
        });
    }// endif;
}

function toggleSearchOverlay() {
    //console.log('On search submit triggered()');

    if(SQSP.vars.isSearchOverlayTransitionActive) return false;
    SQSP.vars.isSearchOverlayTransitionActive = true;

    var $navColumns = SQSP.$objects.stickyHeader.find('.nav-columns'),
        $shareCol = SQSP.$objects.stickyHeader.find('.share-col'),
        $navTable = SQSP.$objects.stickyHeader.find('.nav-table'),
        $searchtable = SQSP.$objects.stickyHeader.find('.search-table'),
        $navVideo = SQSP.$objects.stickyHeader.find('video');

    var $burger = SQSP.$objects.stickyHeader.find('.burger');
    var duration = .4;

    $searchtable.toggleClass('search-on');

    var tl = new TimelineLite({onComplete:function() {
        SQSP.vars.isSearchOverlayTransitionActive = false;
    }});

    if($searchtable.hasClass('search-on')) {
        // open search
        SQSP.vars.isSearchOverlayOpen = true;

        var dummyHeight = $burger.outerHeight() + parseFloat( $burger.css('top') ) + parseFloat( $burger.css('top') );
        var dummyHeightPct = dummyHeight / jQuery(window).height();
        var dummyHeightVH = ( dummyHeightPct * 100 ) + 'vw' ;
        console.log('dummy height calc', dummyHeight, dummyHeightPct, dummyHeightVH);
        //console.log('calc height', height);
        var $dummy = jQuery('<div id="dummy"/>');
        $dummy.css({
            positon: 'fixed',
            height: dummyHeight
        });
        jQuery('body').append($dummy);
        var dummyHeight = $dummy.height();
        //console.log('actual height', dummyHeight);
        var vh = dummyHeight / jQuery(window).height() * 100;
        //console.log('vh height', vh);
        $dummy.remove();

        tl.to($navVideo,duration, {autoAlpha:0, onComplete:function(){ $navVideo.get(0).pause(); }});
        tl.to($navColumns,duration, {height:0, ease:Strong.easeInOut});
        tl.to($shareCol,duration, {autoAlpha:0}, '-='+(duration));
        tl.to($navTable,duration, {height:vh+'vh', ease:Strong.easeInOut}, '-='+(duration));
        tl.to($searchtable,duration, {height:(100-vh)+'vh', ease:Strong.easeInOut}, '-='+(duration));
    } else {
        //close search
        SQSP.vars.isSearchOverlayOpen = false;

        $navColumns.height('auto');
        var navColumnsHeight = $navColumns.height();
        $navColumns.height(0);

        $navVideo.get(0).play();

        tl.to($navVideo,duration, {autoAlpha:1, clearProps:'autoAlpha'});
        tl.to($navColumns,duration, {height:navColumnsHeight, ease:Strong.easeInOut, clearProps:'height'});
        tl.to($shareCol,duration, {autoAlpha:1, clearProps:'autoAlpha'}, '-='+(duration));
        tl.to($navTable,duration, {height:'100vh', ease:Strong.easeInOut, clearProps:'height'}, '-='+(duration));
        tl.to($searchtable,duration, {height:0, ease:Strong.easeInOut}, '-='+(duration));

    }// endif
}// toggleSearchOverlay

function handleStickyBurger(e) {
    //console.log(e);
    SQSP.vars.OldBurgerTimeout = SQSP.vars.newBurgerTimeout;

    if(is_mobile()) {
        console.log('----- shwo burger');
        e.target.$object.container.removeClass('notactive');
        toggleBurger(true);
        return false;
    }
    if(e.posY.current > e.target.options.minY.value) {
        // enable burger
        if(e.target.$object.container.hasClass('notactive')) {
            e.target.$object.container.removeClass('notactive');
            toggleBurger(true);
        }// endif
    } else {
        // disable burger
        if(SQSP.$objects.stickyHeader.hasClass('on')) return false;
        if(!e.target.$object.container.hasClass('notactive')) {
            e.target.$object.container.addClass('notactive');
            toggleBurger(false);
        }// endif
    }// endif

}// customOperation

function toggleBurger(open) {
    TweenMax.killTweensOf(SQSP.$objects.burger);
    TweenMax.killTweensOf(SQSP.$objects.burger.find('.lines'));
    var tl = new TimelineMax();
    var duration = .2;
    var $lines = SQSP.$objects.burger.find('.line');
    if(open) {
        //console.log('Open Burger');
        tl.to(SQSP.$objects.burger, duration, {width:SQSP.$objects.homeLink.width(), ease:Strong.easeOut });
        tl.staggerTo($lines, duration, {width: '100%', ease:Strong.easeOut }, .08, '-='+(duration *.2));
    } else {
        //console.log('Close Burger');
        tl.staggerTo($lines, duration *.7, {width: 0, ease:Strong.easeOut }, -.08);
        tl.to(SQSP.$objects.burger, duration *.7, {width:0, ease:Strong.easeOut }, '-='+(duration *.4));
    }// endif
}// toggleBurger()

function cta_hovers() {
    var ctaSelector = '.cta-container';
    var duration = .2;
    jQuery(ctaSelector).on('mouseenter', function() {
        if(is_mobile()) return false;

        var $hovered = jQuery(this).find('.hover-cta');
        TweenMax.to($hovered, duration, {top:0, ease:Expo.easeOut});
    });
    jQuery(ctaSelector).on('mouseleave', function() {
        if(is_mobile()) return false;

        var $unhovered = jQuery(this).find('.hover-cta');
        //console.log('mouse leaving cta');
        TweenMax.to($unhovered, duration, {width:0, ease:Expo.easeOut, clearProps:'all'});
    });
}

function handleParallax() {
    SQSP.instances.parallaxer = [];

    SQSP.instances.parallaxer.push( new Parallaxer(jQuery('.prllx-stndrd'), {amount:.075}) );

    SQSP.instances.parallaxer.push( new Parallaxer(jQuery('.prllx-lo-stndrd'), { amount: -.04}) );

    SQSP.instances.customParallaxer = new Parallaxer(jQuery('.prllx-custom'), {
        customAmount: function(e) {
            return parseFloat(jQuery(e.$elem).attr('data-prllx'));
        }
    });
}// handleParallax()

function createDisablerDummy() {
    if(elem_exists(jQuery('#disablerDummy'))) return false;

    var $disablerDummy = jQuery('<div id="disablerDummy" class="fill-parent"/>');
    $disablerDummy.css({
        position: 'fixed',
        'z-index' : 999,
        background : 'rgba(0,0,0,.9) url(assets/images/spinner.gif) no-repeat center / 2%',
        opacity :0
    });

    jQuery('body').append($disablerDummy);
    TweenMax.to($disablerDummy,.3, {autoAlpha:.7});
}

function removeDisablerDummy() {
    var $disablerDummy = jQuery('#disablerDummy');
    TweenMax.to($disablerDummy,.4, {autoAlpha:0, onComplete:function(){$disablerDummy.remove()}});
}