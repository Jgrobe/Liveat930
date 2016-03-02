/*
* CanvasPainter creates an <img/> oder <video/> element and paints it on a canvas to clip it with a custom shape
*
* Dependencies:
* jquery-2.1.0.min.js
* lodash.js
* */
var CanvasPainter = function($container, options) {
    if(typeof $container === 'undefined') return;
    var CP = this;
    CP.options = {
        autoInit: true,
        canvasScale: 1,
        layeredCanvas: false,
        texturize: false,
        //colorize: '#ff7800',
        autoPlay: false,
        autoStop: false,
        type: $container.attr('data-type'), // img || video (the actual DOM element)
        mediaSrc: $container.attr('data-src'), // img || video file
        modelClass: false, // [ 'class1', 'class2', ... ]
        modelAttr: false,   // {attr1: val1, attr2: val2, ...}
        loadEvents : {
            video : 'loadeddata',
            img : 'load'
        },
        onCreateComplete: false
    };
    if(typeof options !== 'undefined') jQuery.extend(CP.options, options);
    CP.PLAY = CP.options.autoPlay;
    CP.$object = {
        container: $container
    };

    CP.playVideo = function() {
        if(CP.options.type !== 'video') return false;
        CP.DOM.model.object.play();
        CP.PLAY = true;

        var lastCalledTime = Date.now(), fps = 0, delta;

        CP.drawVideo(function() {

            delta = (Date.now() - lastCalledTime)/1000;
            lastCalledTime = Date.now();
            fps = 1/delta;

            console.log('--------------- RAF FPS', fps);
        });
    };

    CP.stopVideo = function() {
        if(CP.options.type !== 'video') return false;
        CP.DOM.model.object.pause()
        CP.PLAY = false;
    };

    CP.drawVideo = function(fn) {
        ////console.log('playing!');
        ////console.log('context', ctx);
        if(CP.DOM.model.object.paused || CP.DOM.model.object.ended || !CP.PLAY) return false;

        if(CP.options.layeredCanvas) {
            //jQuery(window).resize(); // needed to clear the clipping shape

            CP.DOM.baseCanvas.context.drawImage(
                CP.DOM.model.object,
                0,0,CP.DOM.baseCanvas.object.width,CP.DOM.baseCanvas.object.height
            );
            if(CP.options.texturize) texturize(0, 0, CP.DOM.layerCanvas.object.width, CP.DOM.layerCanvas.object.height);
        }

        //if(CP.redrawShape === true) {
        //    ////console.log('----- REDRAW CLIPPING MASK');
        //    //drawClippingShape();
        //    CP.redrawShape = false;
        //}// endif

        // Draw only the area the size of the clipping shape
        CP.DOM.layerCanvas.context.drawImage(
            CP.DOM.model.object,
            //0,0,CP.DOM.layerCanvas.object.width,CP.DOM.layerCanvas.object.height

            // 1. Define clipped area on original
            // must reverse-compute coordinates to original video size -> hence / CP.RATIO.ratio

            // start clip x
            ( (CP.RATIO.width - CP.DOM.layerCanvas.object.width) *.5 ) / CP.RATIO.ratio,
            // start clip y
            ( (CP.RATIO.height - CP.DOM.layerCanvas.object.height ) *.5 ) / CP.RATIO.ratio,
            // clip width
            (CP.DOM.layerCanvas.object.width / CP.RATIO.ratio),
            // clip height
            (CP.DOM.layerCanvas.object.height / CP.RATIO.ratio),

            // 2. Draw defined area on canvas
            // using canvas coordinates

            // position clip x
            0,//( CP.DOM.layerCanvas.object.width *.5 - CP.DOM.layerCanvas.object.width *.5 ),
            // position clip y
            0,//( CP.DOM.layerCanvas.object.height *.5 - CP.DOM.layerCanvas.object.height *.5 ),
            // clip width
            (CP.DOM.layerCanvas.object.width),
            // clip height
            (CP.DOM.layerCanvas.object.height)
        );
        //CP.draw();

        if(CP.options.autoStop) {
            CP.stopVideo();
        }

        if(_.isFunction(fn)) fn();

        requestAnimationFrame( function() {
            CP.drawVideo(fn)
        } );

    };// drawVideo()

    CP.draw = function() {

        CP.DOM.layerCanvas.context.drawImage(CP.DOM.model.object, 0, 0, CP.DOM.layerCanvas.object.width, CP.DOM.layerCanvas.object.height);

    };// draw()

    CP.init = function() {

        console.log('CanvasPainter', CP);

        createCanvas();

        jQuery(window).load(function() {
            ////console.log('window loaded');
            jQuery(window).trigger('resize');
        }).resize(function() {
            get_sizes();
            CP.redrawShape = true;
            //CP.draw();
        });

    };// init()

    if(CP.options.autoInit) CP.init();

    CP.isTextureReady = false;
    CP.textureImg = new Image();
    var imgsrc = location.origin+'/assets/images/textures/texture-halftone-compressor-2-70k.jpg';
    console.log('the txture img src', CP.textureImg.src);
    CP.textureImg.onload = function() {
        CP.PATTERN = CP.DOM.layerCanvas.context.createPattern(CP.textureImg,"repeat");
        CP.isTextureReady = true;
    };
    CP.textureImg.src = imgsrc;

    function createCanvas() {

        CP.$object.layerCanvas = jQuery('<canvas/>');
        if(CP.options.shapeClass) CP.$object.layerCanvas.addClass(CP.options.shapeClass.join(' '));
        if(CP.options.shapeAttr) {
            for(var attr in CP.options.shapeAttr) {
                CP.$object.layerCanvas.attr(attr, CP.options.shapeAttr[attr]);
            }// endfor
        }// endif

        CP.$object.model = jQuery('<'+ CP.options.type +' src="'+ CP.options.mediaSrc +'"/>');
        if(CP.options.modelClass) CP.$object.model.addClass(CP.options.modelClass.join(' '));
        if(CP.options.modelAttr) {
            for(var attr in CP.options.modelAttr) {
                CP.$object.model.attr(attr, CP.options.modelAttr[attr]);
            }// endfor
        }// endif

        CP.DOM = {
            layerCanvas : {
                object: CP.$object.layerCanvas.get(0),
                context: CP.$object.layerCanvas.get(0).getContext('2d')
            },
            model : {
                object : CP.$object.model.get(0)
            }
        };

        CP.DOM.model.object.load();

        CP.DOM.model.object.addEventListener(CP.options.loadEvents[CP.options.type], function() {
            ////console.log('THE MODEL RATIO: ', CP.DOM.model.object.ratio);
            var onComplete;

            if(CP.options.layeredCanvas) {
                // add the fullscreen canvas
                CP.$object.baseCanvas = jQuery('<canvas/>');

                CP.DOM.baseCanvas = {
                    object: CP.$object.baseCanvas.get(0),
                    context: CP.$object.baseCanvas.get(0).getContext('2d')
                };
                CP.$object.container.append(CP.$object.baseCanvas);
            }// endif

            CP.$object.container.append(CP.$object.layerCanvas);
            CP.$object.container.append(CP.$object.model);
            //jQuery(window).resize();

            //colorize();

            switch(CP.options.type) {
                case 'video' :

                    CP.DOM.model.size = {
                        width: CP.DOM.model.object.videoWidth,
                        height: CP.DOM.model.object.videoHeight
                    };
                    ////console.log('DOM MODEL LOADED => SIZE', CP.DOM.model.size);

                    CP.DOM.model.object.volume = 0;
                    CP.DOM.model.object.addEventListener('ended', function() {
                        CP.playVideo();
                    });

                    if(CP.options.autoPlay) {
                        onComplete = function() {
                            CP.playVideo();
                        };

                        //setTimeout(function() {
                        //    CP.stopVideo();
                        //    //console.log('------------------------------- VIDEO STOPPED');
                        //}, 400);
                    }

                    break;

                case 'img' :

                    CP.DOM.model.size = {
                        width: CP.DOM.model.object.naturalWidth,
                        height: CP.DOM.model.object.naturalHeight
                    };

                    CP.DOM.model.ratio = CP.$object.container.width / CP.DOM.model.object.width;
                    CP.draw();

                    break;

            }// endswitch;

            CP.DOM.model.size.ratio = CP.DOM.model.size.width / CP.DOM.model.size.height;
            get_sizes();

            if(_.isFunction(onComplete)) onComplete();

            if(_.isFunction(CP.options.onCreateComplete)) CP.options.onCreateComplete(CP);
        });

        ////console.log('canvas created');

    }// createCanvas()
    
    //function colorize() {
    //    //return false;
    //    //if(!CP.options.colorize) return false;
    //    CP.DOM.layerCanvas.context.globalCompositeOperation = 'multiply';
    //    CP.DOM.layerCanvas.context.fillStyle = CP.options.colorize;
    //    //console.log('COLORIEZ', CP.DOM.layerCanvas.context.fillStyle);
    //    CP.DOM.layerCanvas.context.fillRect(0, 0, CP.DOM.layerCanvas.object.width, CP.DOM.layerCanvas.object.height)
    //}// colorize()

    function texturize(x, y, width, height) {
        if(!CP.isTextureReady) return false;
        //CP.DOM.layerCanvas.context.globalCompositeOperation = 'multiply';// multiply
        CP.DOM.layerCanvas.context.rect(x, y, width, height);
        CP.DOM.layerCanvas.context.fillStyle = CP.PATTERN;
        CP.DOM.layerCanvas.context.fill();
    }

    function rotateContext(ctx, radians) {
        ctx.save(); // saves the coordinate system
        ctx.translate(ctx.canvas.width *.5, ctx.canvas.height *.5);
        ctx.rotate(radians);
    }// rotateContext()

    function get_sizes() {

        if(typeof CP.DOM.model.size === 'undefined') return false;

        // layerCanvas & baseCanvas always have the same parent but baseCanvas may not always exist
        // so it is safe to use layerCanvas to compute cover size & ratio
        var containerSize = {
            width: CP.$object.container.width(),
            height:CP.$object.container.height()
        };
        //console.log('CP.$object.container', CP.$object.container.width(), CP.DOM.model);
        CP.RATIO = getSizeToCover('cover', containerSize, CP.DOM.model.size);
//console.log('CP RATIO VALUES', CP.RATIO);
        
        if(typeof CP.DOM.baseCanvas !== 'undefined') {
            CP.DOM.baseCanvas.object.width = CP.RATIO.width;
            CP.DOM.baseCanvas.object.height = CP.RATIO.height;
            CP.$object.baseCanvas.css({
                position: 'absolute',
                top: CP.RATIO.top,
                left: CP.RATIO.left
            });
        }

        // set layerCanvas width & height inline -> canvas uses these units to draw
        CP.DOM.layerCanvas.object.width = CP.DOM.layerCanvas.object.height = Math.min(containerSize.width, containerSize.height) * CP.options.canvasScale;
        // set positioning in css
        CP.$object.layerCanvas.css({
            position: 'absolute',
            left: (containerSize.width - CP.DOM.layerCanvas.object.width) *.5,
            top: (containerSize.height - CP.DOM.layerCanvas.object.height) *.5
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