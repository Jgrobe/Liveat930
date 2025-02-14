init_sqsp();


var resizeTimer;
var _initialWindowHeight = 0;
var isWindowGrowing = false;

function init_sqsp() {
    //console.log('----------------------- init sqsp');

    browser_processing();

    populate_namespaces();

    format_lineup_preview();

    // set window listeners
    SQSP.$objects.window.load(function() {
        //console.log('WINDOW LOADED');

        for(var i=0; i<SQSP.functions.windowLoad.length; i++) {
            if(_.isFunction(SQSP.functions.windowLoad[i])) SQSP.functions.windowLoad[i]();
        }

        SQSP.$objects.window.trigger('resize');
        SQSP.$objects.window.trigger('scroll');

        windowloaded();

        //preparePosterLineUpForFontResizing();

    }).resize(function() {
        //console.log('WINDOW RESIZED');
        var _currentWindowHeight = window.innerWidth;
        isWindowGrowing = (_currentWindowHeight > _initialWindowHeight);
        //console.log('is window growing? '+_currentWindowHeight+' > '+_initialWindowHeight, isWindowGrowing);
        _initialWindowHeight = _currentWindowHeight;

        SQSP._IS_MOBILE = is_mobile();

        for(var i=0; i<SQSP.functions.windowResize.length; i++) {
            //console.log('window resize fn:', SQSP.functions.windowResize[i]);
            if(_.isFunction(SQSP.functions.windowResize[i])) SQSP.functions.windowResize[i]();
        }

// ghetto way of adding the font resize timer
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            sizePostersFontSize();
        }, 250);

        //resetPostersFontSize();
        //scalePostersLineupToFit();
    });

    //sizeVideosOnReady();

    //SQSP.functions.createPageHero();
    SQSP.functions.createPageGallery();

    // create cta-container hoverFX
    cta_hovers();

    // hovering .video must trigger its cta-container too
    var $clipItems = jQuery('.video-item');// div is necessary b/c sqsp attaches class 'video' to html ! wtf man
    //console.log('mofo clipitems',$clipItems);
    $clipItems.on('mouseenter', function(e) {
        var $hovered = jQuery(this);
        //console.log('.video mouseenter', $hovered, e);
        $hovered.find('.cta-container:not(.plain)').mouseenter();
    });
    $clipItems.on('mouseleave', function(e) {
        //console.log('.video mouseleave', e);
        var $unhovered = jQuery(this);
        $unhovered.find('.cta-container').mouseleave();
    });
    //$clipItems.click(function(e) {
    //    window.location = jQuery(this).find('.cta-container').attr('href');
    //});

    //manual video loop

    SQSP.vars.keepCheckingVideos = true;
    SQSP.vars.loopvids = [];

    jQuery('video').each(function(i,elem) {
        var vid = this;
        var $thisVid = jQuery(vid);

        vid.addEventListener('loadeddata', function(e) {
            //console.log('-------------------------------------- video loaded -> size em');
            size_video();
            //scrollMonitor.recalculateLocations();// needed on homepage so first video in viewport starts playing on load
            TweenMax.to(e.target,.35,{autoAlpha:1});
        });

        if($thisVid.hasClass('loop')) {
            SQSP.vars.loopvids.push(vid);
        //    vid.addEventListener('timeupdate', function(e) {
        //        console.log('tracking time', e.target.currentTime, e.target.duration);
        //        if(e.target.currentTime > (e.target.duration-.25)) {
        //            console.log('reset video time');
        //            e.target.currentTime = 0;
        //            if(!e.target.playing) e.target.play();
        //        }
        //    });
        }// endif

        if($thisVid.hasAttr('data-src')) {// is no video.js instance
            TweenMax.set(vid,{autoAlpha:0});
            vid.src = $thisVid.data('src');
        }

    });// endeach()

    //console.log('SQSP.vars.loopvids.length', SQSP.vars.loopvids.length);
    checkVideoloop();

    jQuery(document).on('click', '.switch', function(e){
        e.preventDefault();
        var $clicked = jQuery(this);
        TweenMax.to(jQuery('.page'),.5,{autoAlpha:0, onComplete:function(){
            window.location = $clicked.attr('href');
        }});
    });

}// init_page()

function checkVideoloop() {
    if(!SQSP.vars.keepCheckingVideos || SQSP.vars.loopvids.length <= 0) return false;

    for(var i=0; i<SQSP.vars.loopvids.length; i++) {
        var vid = SQSP.vars.loopvids[i];
        //console.log('checking vid', vid.currentTime, vid.duration);
        if(vid.currentTime > (vid.duration-.25)) {
            //console.log('manual loop reset video time');
            vid.currentTime = 0;
            if(!vid.playing) vid.play();
        }
    }// endfor

    requestAnimationFrame( checkVideoloop );
}// checkVideoloop()

function populate_namespaces() {

    SQSP.instances.Preloader = new Preloader({
        autoInit:false,// init after individual initPage so preloader fns can be hooked
        onStart:function() {
            TweenMax.set(jQuery('.page'), {autoAlpha:0});
            SQSP.$objects.preloaderClipables = jQuery('.onloadclip');
            //console.log('--- start preloading');
        },
        onProgress:function(e){
            //console.log('--- still preloading... ', e.progress.pct);
        },
        onComplete:function(e) {

            var initPoints = [
                {x1:0, y1:0, x2:1, y2:0, x3:1, y3:0, x4:0, y4:0, label:'top bottom'},//
                {x1:0, y1:0, x2:0, y2:0, x3:0, y3:1, x4:0, y4:1, label:'left right'},//
                {x1:1, y1:0, x2:1, y2:0, x3:1, y3:1, x4:1, y4:1, label:'right left'},//
                {x1:0, y1:1, x2:1, y2:1, x3:1, y3:1, x4:0, y4:1, label:'bottom top'}//
            ];

            var clipHTML = '<svg style="width:0;height:0;"><defs><clipPath id="mask" clipPathUnits="objectBoundingBox"><polygon points=""></polygon></clipPath></defs></svg>';
            var duration = .4;
            var tl = new TimelineMax();
            var $page = jQuery('.page')
            tl.to($page,duration, {autoAlpha:1, onUpdate:function(){
                //console.log('tweening page into visibilty');
            }, onComplete:function() {
                //console.log('--- page should now be visible');
                $page.addClass('on');
            }});

            SQSP.$objects.preloaderClipables.each(function(i) {

                var $this = jQuery(this),
                    $clipSVG = jQuery(clipHTML),
                    maskID = 'mask_'+ i,
                    polygonPoints = _.cloneDeep( initPoints[ Math.floor(Math.random()*initPoints.length) ] );//
                //console.log('chosen polygon initPoints', polygonPoints.label);

                $clipSVG.find('#mask').attr({id : maskID });
                $clipSVG.insertAfter($this);
                var $polygon = $clipSVG.find('polygon');
                $polygon.attr({points:get_points_string(polygonPoints)['inline']});
                updateCSS($this, maskID, polygonPoints);


                tl.to(polygonPoints, duration, {x1:0,y1:0, x2:1,y2:0, x3:1,y3:1, x4:0,y4:1, onUpdate:function(){

                    //console.log('updateing polygon', polygonPoints.y3);
                    $polygon.attr({
                        points : get_points_string(polygonPoints)['inline']//polygonPoints.x1 +' '+ polygonPoints.y1 +', '+ polygonPoints.x2 +' '+ polygonPoints.y2 +', '+ polygonPoints.x3 +' '+ polygonPoints.y3 +', '+ polygonPoints.x4 +' '+ polygonPoints.y4
                    });
                    updateCSS($this, maskID, polygonPoints);
                }, onComplete:function($elem, $svg){
                    $elem.css({
                        'overflow' : '',
                        'clip-path' : '',
                        '-webkit-clip-path' : ''
                    });
                    $svg.remove();
                }, onCompleteParams:[$this, $clipSVG]}, '-='+(duration *.3));

            });// endeach()

            //console.log('--- preloader return tl');
            return tl;

            function updateCSS($elem, maskID, polygonPoints) {
                $elem.css({
                    'overflow' : 'hidden',
                    'clip-path' : 'url(#'+ maskID +')',
                    '-webkit-clip-path' : get_points_string(polygonPoints)['css']//'polygon('+ (polygonPoints.x1*100) +'% '+ (polygonPoints.y1*100) +'%, '+ (polygonPoints.x2*100) +'% '+ (polygonPoints.y2*100) +'%, '+ (polygonPoints.x3*100) +'% '+ (polygonPoints.y3*100) +'%, '+ (polygonPoints.x4*100) +'% '+ (polygonPoints.y4*100) + '%)'
                    //'-webkit-clip-path' : 'url(#'+ maskID +')'
                    //'-webkit-clip-path' : 'polygon(% %, % %, % %, %, %)'
                });
            }// updateCSS()

            function get_points_string(points) {
                return {
                    inline : points.x1 +' '+ points.y1 +', '+ points.x2 +' '+ points.y2 +', '+ points.x3 +' '+ points.y3 +', '+ points.x4 +' '+ points.y4,
                    css : 'polygon('+ (points.x1*100) +'% '+ (points.y1*100) +'%, '+ (points.x2*100) +'% '+ (points.y2*100) +'%, '+ (points.x3*100) +'% '+ (points.y3*100) +'%, '+ (points.x4*100) +'% '+ (points.y4*100) + '%)'
                }
            }// get_points_string()
        }// onComplete()
    });

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

    // initPage could have served preloader onStart, onProgress, onComplete -> init preloader
    SQSP.instances.Preloader.init();

    SQSP.$objects.landingBG = jQuery('.landing-bg');
    SQSP.$objects.landingVideo = SQSP.$objects.landingBG.find('video').get(0);

    jQuery(window).scroll(function(e) {
        //console.log('e', e, 'scrolltop', jQuery(window).scrollTop());
        //
        //console.log('video time', SQSP.$objects.landingVideo.currentTime);

        if(elem_exists(SQSP.$objects.landingBG)) {
            //SQSP.$objects.landingBG.css({
            //    top : jQuery(window).scrollTop()
            //});

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

    // SEARCH FIELD ENABLE/DISABLE
    SQSP.$objects.staticHeader.find('.search-icon').click(function() {
        var $clicked = jQuery(this);
        var $search = $clicked.parents('.search');
        $search.toggleClass('on');
        if($search.hasClass('on')) {
            $search.find('input').focus();
        }// endif
    });// search click
    SQSP.$objects.staticHeader.find('.clear-icon').click(function() {
        clearSearchField(jQuery(this));
    });// search click
    SQSP.$objects.stickyHeader.find('.clear-icon').click(function() {
        clearSearchField(jQuery(this));
        if(SQSP.vars.isSearchOverlayOpen) toggleSearchOverlay();
    });// search click
    SQSP.$objects.stickyHeader.find('.nav-table').click(function() {
        if(SQSP.vars.isSearchOverlayOpen) toggleSearchOverlay();
    });// search click

    // SEARCH FIELD FUNCTIONALITY
    SQSP.$objects.searchResultsContainer = jQuery('.nav-overlay .results-wrapper');
    SQSP.instances.SEARCH.options.onSuccess = function(query, ajaxHTML, formattedResults) {
        //console.log('search done: ', formattedResults);

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
    //console.log('SQSP.$objects.searchFields', SQSP.$objects.searchFields);
    SQSP.$objects.searchFields.on('focus', function(e) {
        //console.log('--- field has focus');
        var $field = jQuery(this);
        SQSP.vars.focusOnSearch = $field;
    }).on('focusout', function(e) {
        //console.log('--- field has lost focus');
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

    addBackButtonToCart();

}// windowloaded

function toggleNavOverlay() {

    if(!SQSP.vars.isBurgerOn) {toggleBurger(true);}

    SQSP.$objects.stickyHeader.toggleClass('on');
    var $overlay = SQSP.$objects.stickyHeader.find('.nav-overlay');
    var $items = SQSP.$objects.stickyHeader.find('.stagger-item');
    TweenMax.killTweensOf($overlay);
    TweenMax.killTweensOf($items);
    var tl = new TimelineMax();
    if(SQSP.$objects.stickyHeader.hasClass('on')) {
        // open overlay
        //toggleBurger(true);
        //lock(jQuery('body'), '100vh');
        tl.add(function() {
            $overlay.css({display:'block'});
            size_video();
            if(is_mobile()) return false;
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
            $overlay.css({display:''});
            //jQuery(window).scroll();// use to toggle burger
            //unlock(jQuery('body'));
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
    //console.log('burger', $burger.outerHeight(), $burger.height(), $burger.css('top'));
    var duration = .4;

    $searchtable.toggleClass('search-on');

    var tl = new TimelineLite({onComplete:function() {
        SQSP.vars.isSearchOverlayTransitionActive = false;
    }});

    if($searchtable.hasClass('search-on')) {
        // open search
        SQSP.vars.isSearchOverlayOpen = true;

        var dummyHeight = $burger.outerHeight() + ( parseFloat( $burger.css('top') ) *2 );
        var dummyHeightPct = dummyHeight / jQuery(window).height();
        var dummyHeightVH = ( dummyHeightPct * 100 ) + 'vw' ;
        //console.log('dummy height calc', dummyHeight, dummyHeightPct, dummyHeightVH);
        //console.log('calc height', height);
        var $dummy = jQuery('<div id="dummy"/>');
        $dummy.css({
            positon: 'fixed',
            height: dummyHeightVH
        });
        jQuery('body').append($dummy);
        var dummyHeight = $dummy.height();
        //console.log('actual height', dummyHeight);
        var vh = dummyHeight / jQuery(window).height() * 100;
        var tweenHeight = vh+'vh';
        //console.log('---------- open searchoverlay -> navTable vh height', vh, tweenHeight);
        $dummy.remove();

        tl.to($navVideo, duration, {autoAlpha:0, onComplete:function(){ $navVideo.get(0).pause(); }});
        tl.to($navColumns, duration, {height:0, ease:Strong.easeInOut});
        tl.to($shareCol, duration, {autoAlpha:0}, '-='+(duration));
        tl.fromTo($navTable, duration, {height:'100vh'}, {height:vh+'vh', ease:Strong.easeInOut, onUpdate:function(){
            //console.log('--- --- tweening navTable height', this, $navTable.height());
        }}, '-='+(duration));
        tl.to($searchtable,duration, {height:(100-vh)+'vh', ease:Strong.easeInOut, onUpdate:function(){
            //console.log('--- --- tweening searchTable height', $searchtable.height());
        }}, '-='+(duration));
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
        tl.to($searchtable,duration, {height:0, ease:Strong.easeInOut, onComplete:function(){
            jQuery(window).scroll();// used to hide burger if scrolltop 0
        }}, '-='+(duration));

    }// endif
}// toggleSearchOverlay

function handleStickyBurger(e) {
    //console.log(e);
    SQSP.vars.OldBurgerTimeout = SQSP.vars.newBurgerTimeout;

    if(is_mobile()) {
        //console.log('----- shwo burger');
        e.target.$object.container.removeClass('notactive');
        toggleBurger(true);
        return false;
    }
    if(e.posY.current > (e.target.options.minY.value)*1.5) {
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
    var tl = new TimelineMax({onComplete:function(){

    }});
    var duration = .2;
    var $lines = SQSP.$objects.burger.find('.line');
    if(open) {
        //console.log('Open Burger');
        SQSP.vars.isBurgerOn = true;
        tl.to(SQSP.$objects.burger, duration, {width:SQSP.$objects.homeLink.width(), ease:Strong.easeOut });
        tl.staggerTo($lines, duration, {width: '100%', ease:Strong.easeOut }, .08, '-='+(duration *.2));
    } else {
        //console.log('Close Burger');
        SQSP.vars.isBurgerOn = false;
        tl.staggerTo($lines, duration *.7, {width: 0, ease:Strong.easeOut }, -.08);
        tl.to(SQSP.$objects.burger, duration *.7, {width:0, ease:Strong.easeOut }, '-='+(duration *.4));
    }// endif
}// toggleBurger()

function cta_hovers() {
    SQSP.vars.ctaHoverTimer = false;

    var ctaSelector = '.cta-container';
    var duration = .2;
    jQuery(ctaSelector).on('mouseenter', function() {
        if(is_mobile()) return false;
        //console.log('cta hover()');
        var $hovered = jQuery(this);
        if($hovered.get(0).isHovered) return false;
        //console.log('--------- HOVER EXECUTED???');
        $hovered.get(0).isHovered = true;

        //console.log('cta hover()', $hovered);

        var $hoverlay = $hovered.find('.hover-cta');

        if(SQSP.vars.ctaHoverTimer) clearTimeout(SQSP.vars.ctaHoverTimer);

        SQSP.vars.ctaHoverTimer = setTimeout(function(){
            //console.log('--------- HOVER TIMEOUT EXECUTED???');
            TweenMax.to($hoverlay, duration, {top:0, ease:Expo.easeOut, onUpdate:function(){
                //console.log('tweening cta', this);
            }, onComplete:function(){
                //console.log('--------- HOVER TWEEN EXECUTED???');
            }});
        }, 150);
    });
    jQuery(ctaSelector).on('mouseleave', function() {
        if(SQSP.vars.ctaHoverTimer) clearTimeout(SQSP.vars.ctaHoverTimer);
        if(is_mobile()) return false;

        var $unhovered = jQuery(this);
        if(!$unhovered.get(0).isHovered) return false;
        $unhovered.get(0).isHovered = false;
        var $hoverlay = $unhovered.find('.hover-cta');
        //console.log('mouse leaving cta');
        TweenMax.to($hoverlay, duration, {width:0, ease:Expo.easeOut, clearProps:'all',onComplete:function() {
        }});
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

    var $disablerDummy = jQuery('<div id="disablerDummy"/>');
    //$disablerDummy.css({
    //    position: 'fixed',
    //    'z-index' : 999,
    //    background : 'rgba(0,0,0,.9) url(assets/images/spinner.gif) no-repeat center / 2%',
    //    opacity :0
    //});

    jQuery('body').append($disablerDummy);
    TweenMax.to($disablerDummy,.3, {autoAlpha:.7});
}

function removeDisablerDummy() {
    var $disablerDummy = jQuery('#disablerDummy');
    TweenMax.to($disablerDummy,.4, {autoAlpha:0, onComplete:function(){$disablerDummy.remove()}});
}

function browser_processing() {
    var $nomsie = jQuery('.no-msie'),
        $msie = jQuery('.msie'),
        $html = jQuery('html');

    if(bowser.msie) {
        $html.addClass('is-ie');
        $nomsie.remove();
        $msie.each(function(){
            var $this = jQuery(this);
            $this.children().unwrap();
        });
    } else {
        $html.addClass('is-no-ie');
        $msie.remove();
        $nomsie.each(function(){
            var $this = jQuery(this);
            $this.children().unwrap();
        });
    }
}

function format_lineup_preview(truncate) {
    if(typeof truncate === 'undefined') truncate = false;
    // used where artits lists have to be shortened to '... & more'
    var $lineupPreview = jQuery('.lineup_preview');
    $lineupPreview.each(function(){
        var $thisLineup = jQuery(this);
        var previewwartists = $thisLineup.data('artists');
        if(truncate) {
            previewwartists = previewwartists.split(',').slice(0,4).join(' / ') +' & more';
        }
        $thisLineup.append(previewwartists);
    });
}

function addBackButtonToCart() {
    var $cart = jQuery('#sqs-shopping-cart-wrapper');
    if($cart.length <= 0) return false;

    var $btn = jQuery('<div class="backtomerch" />');
    var $a = jQuery('<a href="/products/"><span class="back-arrow">←</span> Back to Merch Booth</a>');
    TweenMax.set($btn, {position: 'absolute', y:-50, cursor: 'pointer', 'font-size': '11px'});
    $btn.append($a);
    $cart.prepend($btn);
    //$btn.click(function(){ history.back(); });
}

//var recCount;
function sizePostersFontSize() {
    var $posters = jQuery('.poster');
    if(!$posters.length) return false;

    $posters.each(function(i, elem) {
        //if(i > 0) return false;// DEV

        var $thisPoster = jQuery(this);
        var $lineUp = $thisPoster.find('.ep-lineup');
        if(!$lineUp.length) return true;

        if(isWindowGrowing) {
            $lineUp.css({
                'font-size' : '',
                'line-height' : ''
            });
        };
        //
        //var opts = {
        //    excludeFromLetterCount: '.description',
        //    onTextComplete : function(txt) {
        //        return txt.split('/').join(' / ');
        //    }
        //};
        //adjustFontSizeByCharCount($lineUp, opts);

        //recCount = 0;
        recursivelyCorrectLineupFontsize($lineUp);
    });
}

function recursivelyCorrectLineupFontsize($container) {
    //if(recCount > 5) {
    //    console.log('------------------- hit stack limit -> return');
    //    return false;
    //}
    //
    //recCount++;

    var sizingStep = 4;// px

    var cHeight = $container.height();
    //var overflowHeight = $container.get(0).scrollHeight;
    var textHeight = getActualHeight($container);
    var currentFontsize = parseFloat($container.css('font-size'));

    //console.log('check fontsize', currentFontsize, textHeight, cHeight);

    if(textHeight > cHeight) {
        //console.log('size down', textHeight, cHeight);
        // text height is greater than container height -> decrease
        $container.css({
            'font-size' : (Math.round(currentFontsize) - sizingStep) + 'px',
            'line-height' : '100%'
        });
        //requestAnimationFrame( function() {
            recursivelyCorrectLineupFontsize($container);
        //});
    } else {
        // text height is smaller than container height -> find out how much smaller the text is
        //var textHeight = getInnerHeight($container);
        //console.log('check text size', textHeight, cHeight, 'difference: '+(cHeight-textHeight));

        if((cHeight-textHeight) > currentFontsize*2) {
            // text is too small -> reset & resize again
            $container.css({
                'font-size' : ''
            });
            //console.log('restart sizing');
            //requestAnimationFrame(function() {
                recursivelyCorrectLineupFontsize($container);
            //});
        }// endif
    }// endif

}// recursivelyCorrectLineupFontsize();

function getActualHeight($container) {
    $container.css({height:'auto'});
    var innerHeight = $container.height();
    $container.css({height: ''});
    return innerHeight;
}


//function preparePosterLineUpForFontResizing() {
//    var $posters = jQuery('.poster');
//    if(!$posters.length) return false;
//
//    console.log('scalePostersLineupToFit()');
//
//    $posters.each(function(i, elem) {
//        var $thisPoster = jQuery(this);
//        var $lineUp = $thisPoster.find('.ep-lineup');
//
//        $lineUp.css({height:'auto'});
//        $lineUp.get(0).origHeight = $lineUp.height();
//        $lineUp.css({height:''});
//        $lineUp.get(0).targetHeight = $lineUp.height();
//
//        $lineUp.get(0).sizeRatio = $lineUp.get(0).origHeight / $lineUp.get(0).targetHeight;
//
//        $lineUp.get(0).origFontsize = parseFloat($container.css('font-size'));
//
//
//    });
//
//    sizePostersFontSizeByHeight($posters);
//
//}// preparePosterLineUpForFontResizing()

//function sizePostersFontSizeByHeight($posters) {
//    if(typeof $posters === 'undefined') $posters = jQuery('.poster');
//    if(!$posters.length) return false;
//
//    $posters.each(function(i,elem){
//        var $thisPoster = jQuery(this);
//        var $lineUp = $thisPoster.find('.ep-lineup');
//    });// endeach()
//
//}

//function scalePostersLineupToFit() {
//
//    var $posters = jQuery('.poster');
//    if(!$posters.length) return false;
//
//    console.log('scalePostersLineupToFit()');
//
//    $posters.each(function(i, elem) {
//        var $thisPoster = jQuery(this);
//        var $lineup = $thisPoster.find('.ep-lineup');
//        $lineup.css({height:'100%'});
//        var containerProps = {
//            width:$lineup.width(),
//            height:$lineup.height()
//        };
//        $lineup.css({height:''});
//        var lineupProps = {
//            width: $lineup.width(),
//            height: $lineup.height()
//        };
//
//        var heightScale = containerProps.height / lineupProps.height;
//        console.log('getting heightScale', containerProps.height, lineupProps.height, heightScale);
//
//        TweenMax.set($lineup, {transformOrigin:'0 0', scale:heightScale});
//
//    });
//}// scalePostersLineupToFit()

//function resetPostersFontSize() {
//    var $posters = jQuery('.poster');
//    if(!$posters.length) return false;
//
//    if(window.postersfontsizereseted) return false;
//
//    console.log('sizePostersFontSize()');
//
//    $posters.each(function(i, elem) {
//
//        var $thisPoster = jQuery(this);
//        var $lineUp = $thisPoster.find('.ep-lineup');
//        $lineUp.css({
//            'font-size' : '',
//            'line-height' : ''
//        })
//    });
//
//    window.postersfontsizereseted = true;
//}
//
//function adjustFontSizeByOverflow($container, options) {
//    if (typeof options === 'undefined') options = {};
//
//    var cHeight = $container.height();
//    var overflowHeight = $container.get(0).scrollHeight;
//    var currentFontsize = parseFloat($container.css('font-size'));
//    var scaledFontsize = 0;//safety default
//    console.log('adjust by overflow', cHeight, overflowHeight, currentFontsize);
//
//    if(overflowHeight > cHeight) {
//        console.log('-------------- DECREASE');
//        // text is overflowing -> reduce font-size by height:overflow ratio
//        var overflowRatio = cHeight / overflowHeight;
//        scaledFontsize = currentFontsize * overflowRatio;
//        console.log('scale font size by ratio ', overflowRatio, scaledFontsize);
//    } else {
//
//        $container.css({
//            'font-size' : '1000px'
//        });
//        adjustFontSizeByOverflow($container);
//        return;
//        //
//        //console.log('-------------- INCREASE');
//        //// text is not filling container -> increase font-size by span:last-child offset-bottom ratio
//        //var $lastChild = $container.children().last();
//        //var bottomOffset = $lastChild.position().top + $lastChild.height();
//        //console.log('increase font-size: nuf space?', bottomOffset, currentFontsize*1.5, (bottomOffset < currentFontsize * 1.5));
//        ////return;
//        //if(bottomOffset < currentFontsize * 1.5) {
//        //    // text wouldnt fit any more if increase font-size caused another linebreak
//        //    return;
//        //} else {
//        //    var increaseRatio = 1 + bottomOffset / cHeight;
//        //    console.log('increase ratio = ', increaseRatio);
//        //    scaledFontsize = currentFontsize * increaseRatio;
//        //}// endif nuf space
//    }// endif
//
//    var fontsize = Math.round(scaledFontsize)+'px';
//    console.log('assigning fontSize: '+fontsize);
//
//    $container.css({
//        'font-size' : fontsize,
//        'line-height': fontsize
//    })
//
//}// adjustFontSizeByOverflow()
//
//function adjustFontSizeByCharCount($container, options) {
//    if(typeof options === 'undefined') options = {};
//
//    // base ratio: ($container width 800px) / (lettercount 98 @ font-size 7.2vw) * (ratio x) = ~ 92px
//    var settings = jQuery.extend({
//        ratio: 10
//    }, options);
//
//    var cWidth = $container.width();
//    var fullText = $container.text();
//    var letterCount = fullText.length;
//    //console.log('full container text', $container.text());
//    //console.log('adjusting dynamic fontsize @ container width '+cWidth+' | letterCount: '+letterCount);
//
//    var $excludes = $container.find(settings.excludeFromLetterCount);
//    if($excludes.length > 0) {
//        //var excludeCount = 0;
//
//        $excludes.each(function(i, elem) {
//            var $this = jQuery(this);
//            var thisText = $this.text();
//            //excludeCount += thisText.length;
//            fullText = fullText.replace(thisText, '').trim();
//        });// endeach
//
//        if(settings.onTextComplete) {
//            fullText = settings.onTextComplete(fullText);
//        }
//
//        //console.log('excluded letters from '+$excludes.length+' elems: '+excludeCount);
//
//        console.log('new full text:\n', fullText);
//        //letterCount -= excludeCount;
//        letterCount = fullText.length;
//        console.log('lettercount - excludes: '+letterCount);
//
//    }// endif
//
//    var fontSize = Math.round( cWidth / letterCount * settings.ratio ) + 'px';
//    console.log('fontsize: '+fontSize);
//
//    $container.css({
//        'font-size' : fontSize,
//        'line-height' : fontSize
//    });
//
//}// adjustFontSizeByCharCount()