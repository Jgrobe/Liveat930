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
console.log('git add');
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

        SQSP.instances.Posters.push( new ScrollPoster($thisPoster, {
            autoInit : false,
            hoverTriggerSelector : '.artist',
            unhoverTriggerSelector : '.artist'
            //scrollModel:new ClippedCanvas($modelContainer, {
            //    autoPlay: true,
            //    autoStop: true,
            //    type: 'video',
            //    modelAttr: {loop:'loop'},
            //    shape: $modelContainer.attr('data-shape')
            //})
        }) );

        SQSP.instances.Posters[i].$object.hoverApplicants = [SQSP.$objects.postersContainer, SQSP.instances.Posters[i].$object.hoverLayer];
        SQSP.instances.Posters[i].init();

        //var scrollBtn = new ScrollHeader(SQSP.instances.Posters[i].$object.find('.btn-play-episode'),{
        //    customOperation: function(e) {
        //        if(e.posY.current >= e.target.$object.)
        //    }
        //});

        var scrollTracker = scrollMonitor.create($thisPoster.get(0));
        //console.log('scrollTracker', scrollTracker);

        scrollTracker.enterViewport(function() {
            onEnterViewPort(SQSP.instances.Posters[i]);
        });
        scrollTracker.exitViewport(function() {
            onExitViewPort(SQSP.instances.Posters[i]);
        });
        scrollTracker.fullyEnterViewport(function() {
            onFullyEnterViewPort(SQSP.instances.Posters[i]);
        });
        scrollTracker.partiallyExitViewport(function() {
            onPartiallyExitViewPort(SQSP.instances.Posters[i]);
        });


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
});

function onEnterViewPort(instance) {}
function onExitViewPort(instance) {}
function onFullyEnterViewPort(instance) {
    //console.log('fully entered');
    //instance.$object.hoverLayer.addClass('active');
}
function onPartiallyExitViewPort(instance) {
    //console.log('partial exit');
    //instance.$object.hoverLayer.removeClass('active');
}

// STAR SHAPE PREVIEW
//function create_canvas_poster($container, posterType, videoSrc, videoImg) {
//
//    var $video = jQuery('<video src="' + videoSrc + '" class="no_size_video" loop/>');
//    var canvas = document.createElement('canvas');
//    var $canvas = jQuery(canvas);
//
//    $container.append($canvas);
//    $container.append($video);
//
//    var video = $video.get(0);
//    video.load();
//
//    var ctx = canvas.getContext('2d');
//
//    //var cw = $container.width();
//    //var ch = $container.height();
//
//    video.addEventListener('loadeddata', function() {
//        //console.log('video loaded!');
//        //video.scale = (cw/video.videoWidth);
//        //console.log('video scale', video.scale);
//        //TweenMax.set(canvas, {width:video.videoWidth, height:video.videoHeight, top:'50%', left:'50%', x:'-50%', y:'-50%', scale:video.scale});
//
//        canvas.width = video.videoWidth;
//        canvas.height = video.videoHeight;
//        video.ratio = $container.width / video.videoWidth;
//        playVideo(video, ctx);
//    });
//
//
//}// create_canvas_poster()
//
//var star = [
//    {x:43.5, y:0},
//    {x:32.8, y:33.7},
//    {x:0, y:43.6},
//    {x:27.5, y:64.6},
//    {x:26.5, y:100},
//    {x:54.2, y:79.3},
//    {x:86.3, y:91.3},
//    {x:76,y: 57.5},
//    {x:96.9, y:29.5},
//    {x:62.7, y:29.3}
//];
//
//function playVideo(video, ctx) {
//    video.play();
//    drawVideo(video, ctx);
//}// playVideo()
//
//function drawVideo(video, ctx) {
//    //console.log('context', ctx);
//    if(video.paused || video.ended) return false;
//    //console.log(video.currentTime);
//    var self = this;
//
//    //rotateContext(ctx,.3);
//    drawClipPath(ctx, star);
//    ctx.clip();
//    //rotateContext(ctx,-.3);
//    ctx.drawImage(video, 0, 0, ctx.canvas.width, ctx.canvas.height);
//    requestAnimationFrame( function() {
//        self.drawVideo(video, ctx)
//    } );
//}// drawVideo()
//
//function drawClipPath(ctx, points) {
//    var canvasSize = {
//        width:ctx.canvas.width,
//        height: ctx.canvas.height
//        }, minX=0, shapeWidth=0, minY=0, shapeHeight=0;
//    // get shape size by getting max Coordinates
//    for(var i=0;i<points.length; i++) {
//        //if(points[i].x < minX) minX = points[i].x;
//        if(points[i].x > shapeWidth) shapeWidth = points[i].x;
//        //if(points[i].y < minY) minY = points[i].y;
//        if(points[i].y > shapeHeight) shapeHeight = points[i].y;
//    }// endfor
//    // draw shape
//    ctx.beginPath();
//    for(var i=0;i<points.length; i++) {
//        var nextPointX = (points[i].x *canvasSize.height/100) + (canvasSize.width*.5) - (shapeWidth *.5 *canvasSize.height/100);
//        var nextPointY = (points[i].y *canvasSize.height/100);// + (canvasSize.height*.5) - (shapeWidth *.5 *canvasSize.width/100);
//        console.log(points[i]);
//
//        if(i <= 0) {
//            ctx.moveTo(nextPointX, nextPointY);
//        } else {
//            ctx.lineTo(nextPointX, nextPointY);
//        }// endif
//    }// endfor
//    ctx.closePath();
//}// drawClipPath
//
//function rotateContext(ctx, radians) {
//    ctx.save(); // saves the coordinate system
//    ctx.translate(ctx.canvas.width *.5, ctx.canvas.height *.5);
//    ctx.rotate(radians);
//}// rotateContext()