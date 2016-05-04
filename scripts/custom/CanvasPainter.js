/*
 * CanvasPainter creates an <img/> oder <video/> element and paints it on a canvas to clip it with a custom shape
 *
 * Dependencies:
 * jquery-2.1.0.min.js
 * lodash.js
 * */
var CanvasPainter = function($container, $model, options) {
    if(typeof $container === 'undefined' || typeof $model === 'undefined') return;
    if(typeof options === 'undefined') options = {};
    var CP = this;
    CP.options = jQuery.extend({
        canvasScale: 1,
        autoPlay: true,
        autoStop: false,
        autoInit: true,
        canvasClass: false, // [ 'class1', 'class2', ... ]
        canvasAttr: false,   // {attr1: val1, attr2: val2, ...}
        modelClass: false, // [ 'class1', 'class2', ... ]
        modelAttr: false,   // {attr1: val1, attr2: val2, ...}
        loadEvents : {
            video : '',
            img : 'load'
        },
        wrapperClass : 'canvas-wrapper',
        onCreateComplete: false
    }, options);

    CP.PLAY = CP.options.autoPlay;
    CP.$object = {
        container: $container,
        model: $model
    };

    CP.playVideo = function() {
        CP.DOM.model.object.play();
        CP.PLAY = true;

        var lastCalledTime;
        var fps;

        CP.drawVideo(function() {
            if(!lastCalledTime) {
                lastCalledTime = Date.now();
                fps = 0;
                return;
            }
            var delta = (Date.now() - lastCalledTime)/1000;
            lastCalledTime = Date.now();
            fps = 1/delta;
            //console.log('RAF FPS', fps);
        });
    };

    CP.stopVideo = function() {
        CP.DOM.model.object.pause();
        CP.PLAY = false;
    };

    CP.drawVideo = function(fn) {
        //console.log('playing and drawing');
        ////console.log('context', ctx);
        if(CP.DOM.model.object.paused || CP.DOM.model.object.ended || !CP.PLAY) return false;

        if(_.isFunction(fn)) fn();

        CP.draw();

        if(CP.options.autoStop) {
            CP.stopVideo();
        }

        requestAnimationFrame( function() {
            CP.drawVideo(fn);
        } );

    };// drawVideo()

    CP.draw = function() {

        if(typeof CP.RATIO === 'undefined' || typeof CP.DOM.canvas.object === 'undefined') return false;
        // Draw only the area the size of the clipping shape

        CP.DOM.canvas.context.drawImage(
            CP.DOM.model.object,
            //0,0,CP.DOM.canvas.object.width,CP.DOM.canvas.object.height

            // 1. Define clipped area on original
            // must reverse-compute coordinates to original video size -> hence / CP.RATIO.ratio
            // start clip x
            ( (CP.RATIO.width - CP.DOM.canvas.object.width) *.5 ) / CP.RATIO.ratio,
            // start clip y
            ( (CP.RATIO.height - CP.DOM.canvas.object.height ) *.5 ) / CP.RATIO.ratio,
            // clip width
            (CP.DOM.canvas.object.width / CP.RATIO.ratio),
            // clip height
            (CP.DOM.canvas.object.height / CP.RATIO.ratio),

            // 2. Draw defined area on canvas
            // using canvas coordinates

            // position clip x
            0,//( CP.DOM.canvas.object.width *.5 - CP.DOM.canvas.object.width *.5 ),
            // position clip y
            0,//( CP.DOM.canvas.object.height *.5 - CP.DOM.canvas.object.height *.5 ),
            // clip width
            (CP.DOM.canvas.object.width),
            // clip height
            (CP.DOM.canvas.object.height)
        );

        //CP.DOM.canvas.context.drawImage(CP.DOM.model.object, 0, 0, CP.DOM.canvas.object.width, CP.DOM.canvas.object.height);

    };// draw()

    CP.init = function() {

        //console.log('CanvasPainter', CP);

        createCanvas();

        jQuery(window).load(function() {
            ////console.log('window loaded');
            //jQuery(window).trigger('resize');
        }).resize(function() {
            get_sizes();
            CP.draw();
        });

    };// init()

    if(CP.options.autoInit) CP.init();

    function createCanvas() {

        CP.$object.canvasWrapper = jQuery('<div class="'+ CP.options.wrapperClass +'"/>');
        CP.$object.canvas = jQuery('<canvas/>');
        CP.$object.canvasWrapper.append(CP.$object.canvas);

        if(CP.options.canvasClass) CP.$object.canvas.addClass(CP.options.canvasClass.join(' '));
        if(CP.options.canvasAttr) {
            for(var attr in CP.options.canvasAttr) {
                CP.$object.model.attr(attr, CP.options.canvasAttr[attr]);
            }// endfor
        }// endif

        if(CP.options.modelClass) CP.$object.model.addClass(CP.options.modelClass.join(' '));
        if(CP.options.modelAttr) {
            for(var attr in CP.options.modelAttr) {
                CP.$object.model.attr(attr, CP.options.modelAttr[attr]);
            }// endfor
        }// endif

        CP.DOM = {
            canvas : {
                object: CP.$object.canvas.get(0),
                context: CP.$object.canvas.get(0).getContext('2d')
            },
            model : {
                object : CP.$object.model.get(0)
            }
        };

        CP.DOM.model.object.load();

        CP.DOM.model.object.addEventListener('loadeddata', function() {
            //console.log('----------------------- VIDEO LOADED');

            CP.$object.container.append(CP.$object.canvasWrapper);
            //CP.$object.container.append(CP.$object.model);
            //jQuery(window).resize();

            CP.DOM.model.size = {
                width: CP.DOM.model.object.videoWidth,
                height: CP.DOM.model.object.videoHeight
            };
            CP.DOM.model.size.ratio = CP.DOM.model.size.width / CP.DOM.model.size.height;
            get_sizes();
            ////console.log('DOM MODEL LOADED => SIZE', CP.DOM.model.size);

            CP.DOM.model.object.volume = 0;
            CP.DOM.model.object.addEventListener('ended', function() {
                CP.playVideo();
            });

            if(CP.options.autoPlay) CP.playVideo();

            if(_.isFunction(CP.options.onCreateComplete)) CP.options.onCreateComplete(CP);
        });

        ////console.log('canvas created');

    }// createCanvas()

    function get_sizes() {

        if(typeof CP.DOM.model.size === 'undefined') return false;

        var containerSize = {
            width: CP.$object.container.width(),
            height:CP.$object.container.height()
        };
        //console.log('CP.$object.container', CP.$object.container.width(), CP.DOM.model);
        CP.RATIO = getSizeToCover('cover', containerSize, CP.DOM.model.size);
        //console.log('CP RATIO VALUES', CP.RATIO);

        // set canvas width & height inline -> canvas uses these units to draw
        CP.DOM.canvas.object.width = CP.DOM.canvas.object.height = Math.min(containerSize.width, containerSize.height) * CP.options.canvasScale;
        // set positioning in css
        CP.$object.canvasWrapper.css({
            position: 'absolute',
            left: (containerSize.width - CP.DOM.canvas.object.width) *.5,
            top: (containerSize.height - CP.DOM.canvas.object.height) *.5
        })

    }// get_sizes()


    function getSizeToCover(mode, parent, child) {
        //console.log(mode, parent, child);
        var scaleFactor;
        switch(mode) {
            case 'cover':
                scaleFactor = Math.max( parent.width/child.width , parent.height / child.height);
                break;
            case 'contain':
                scaleFactor = Math.min( parent.width/child.width , parent.height / child.height);
                break;
        };// endswitch
        var newWidth = child.width * scaleFactor;
        var newHeight = child.height * scaleFactor;
        var offsetX = (parent.width-newWidth) *.5;
        var offsetY = (parent.height-newHeight) *.5;

        return {
            width: newWidth,
            height: newHeight,
            ratio: scaleFactor,
            left:offsetX,
            top:offsetY
        };
    }// getSizeToCover()

};// CanvasPainter()