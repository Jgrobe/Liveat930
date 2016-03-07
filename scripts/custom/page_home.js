SQSP.functions.initPage = function() {


    SQSP.$objects.postersContainer = jQuery('.posters');
    SQSP.$objects.postersHoverContainer = SQSP.$objects.postersContainer.find('.posters-hover-bg');
    //console.log('hovercontainer', SQSP.$objects.postersHoverContainer);
    SQSP.$objects.posters = jQuery('.poster');
    SQSP.instances.Posters = [];

    SQSP.$objects.preloader = jQuery('#preloader');
    if(elem_exists(SQSP.$objects.preloader)) {

        SQSP.instances.Preloader = new Preloader({
            onStart:function(e) {
                SQSP.faders = jQuery('.static-header, .site-content');
                SQSP.preloadTL = new TimelineMax({});
                TweenMax.set(SQSP.faders, {autoAlpha:0});
                TweenMax.set('body', {autoAlpha:1});

                SQSP.$objects.postersContainer.css({
                    position: 'relative',
                    top : '100vh'
                });
            },
            onProgress:function(e) {
                //console.log('preloading', e.progress);
                console.log(SQSP.$objects.preloader.find('.filler'),e.progress,  (e.progress.pct*100));
                SQSP.preloadTL.to(SQSP.$objects.preloader.find('.filler'),.2,{width: (e.progress.pct*100)+'%'});
            },
            onComplete:function(e) {
                console.log('preloader complete');
                console.log('NICE REVEAL');
                SQSP.preloadTL.add(function() {
                    var tl = new TimelineMax({delay:.2, onUpdate:function() {

                        jQuery(window).scroll();
                    }});
                    tl.to(SQSP.$objects.preloader,.2, {autoAlpha:0});
                    tl.to(SQSP.faders,.3, {autoAlpha:1}, '-=.35');
                    tl.to(SQSP.$objects.postersContainer,.75, {top:0,ease:Strong.easeOut, clearProps:'all'}, '-=.15');
                    return tl;
                });
            }
        });
    }

    // CREATE INTERACTIVE POSTERS
    SQSP.$objects.posters.each(function(i) {

        var $thisPoster = jQuery(this);
        var $modelContainer = $thisPoster.find('.model-container');

        var thisShape = new SVGClipper($modelContainer, {
            shape: $modelContainer.data('shape'),
            maskID: ('clipshape_'+i),
            onInit:function(Clip) {
                //GradientMaps.applyGradientMap(Clip.DOM.container.object, Clip.shapes[Clip.options.shape].gradientMaps.shape);
            }
        });

        SQSP.instances.Posters.push( new ScrollPoster($thisPoster, {
            autoInit : false,
            hoverTriggerSelector : '.artist',
            unhoverTriggerSelector : '.artist',
            gradientMap : thisShape.SHAPE.gradientMaps.shape
            //scrollModel:new ClippedCanvas($modelContainer, {
            //    autoPlay: true,
            //    autoStop: true,
            //    type: 'video',
            //    modelAttr: {loop:'loop'},
            //    shape: $modelContainer.attr('data-shape')
            //})
        }) );

        SQSP.instances.Posters[i].$object.hoverClassApplicants.push(SQSP.$objects.postersContainer);
        SQSP.instances.Posters[i].$object.hoverFXApplicants = [SQSP.$objects.postersHoverContainer, SQSP.instances.Posters[i].$object.hoverLayer];
        SQSP.instances.Posters[i].init();

        //var scrollBtn = new ScrollHeader(SQSP.instances.Posters[i].$object.find('.btn-play-episode'),{
        //    customOperation: function(e) {
        //        if(e.posY.current >= e.target.$object.)
        //    }
        //});

        var scrollTracker = scrollMonitor.create($thisPoster.get(0));
        //console.log('scrollTracker', scrollTracker);

        scrollTracker.enterViewport(function() {
            onPosterEnterViewPort($thisPoster);
        });
        scrollTracker.exitViewport(function() {
            onPosterExitViewPort($thisPoster);
        });
        //scrollTracker.fullyEnterViewport(function() {
        //    onFullyEnterViewPort(SQSP.instances.Posters[i]);
        //});
        //scrollTracker.partiallyExitViewport(function() {
        //    onPartiallyExitViewPort(SQSP.instances.Posters[i]);
        //});


        // test: using only first poster
        //return false;
        //test

    });



    // CREATE TRACKINGFIELDS FOR ARTIST HOVER LABEL

    SQSP.instances.FieldTracker = new FieldTracker(jQuery('#fieldTracker'), {
        fieldSelector: '.posters.hover-on',
        functions: {
            onStart: function(e, instance) {
                //console.log('START CURSOR TRACKING');
                //instance.$object.tracker.addClass('active'); // -> THIS HANDLER HAS MOVED TO .artist click()
            },
            onTrack: function(e, instance) {
                //console.log(e.clientX);
                //var rotation = e.clientX > window.innerWidth *.5 ? 0 : 180;
                //TweenMax.set(instance.$object.tracker, { display: 'block', rotation: rotation});
            },
            onStop: function(e, instance) {
                //console.log('STOP CURSOR TRACKING');
                //instance.$object.tracker.removeClass('active');
            }
        }
    });// new TrackingField()

    //jQuery(document).on('click', function() {
    //   console.log('CLICKED!');
    //    console.log('scrollmodel', SQSP.instances.Posters[0].options.scrollModel);
    //    if(SQSP.instances.Posters[0].options.scrollModel.PLAY) {
    //        SQSP.instances.Posters[0].options.scrollModel.stopVideo();
    //    } else {
    //        SQSP.instances.Posters[0].options.scrollModel.playVideo();
    //    }
    //});
};

jQuery(window).load(function() {
    for(var i=0; i<SQSP.instances.Posters.length; i++) {
        //SQSP.instances.Posters[i].options.scrollModel.playVideo();
        //SQSP.instances.Posters[i].options.scrollModel.stopVideo();
        //console.log('------------------------------- VIDEO STOPPED',SQSP.instances.Posters[i]);
    }
    //setTimeout(function() {
        //SQSP.instances.Posters[i].stopVideo();
        //console.log('------------------------------- VIDEO STOPPED');
    //}, 400);
});// load()

function onPosterEnterViewPort($poster) {
    $poster.find('video').get(0).play();
}
function onPosterExitViewPort($poster) {
    $poster.find('video').get(0).pause();
}

//function onFullyEnterViewPort(instance) {
//    //console.log('fully entered');
//    //instance.$object.hoverLayer.addClass('active');
//}
//function onPartiallyExitViewPort(instance) {
//    //console.log('partial exit');
//    //instance.$object.hoverLayer.removeClass('active');
//}