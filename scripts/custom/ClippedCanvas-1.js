/*
* ClippedCanvas creates an <img/> oder <video/> element and paints it on a canvas to clip it with a custom shape
*
* Dependencies:
* jquery-2.1.0.min.js
* lodash.js
* */
var ClippedCanvas = function($container, options) {
    if(typeof $container === 'undefined') return;
    var CC = this;
    CC.options = {
        canvasScale: 1,
        shapeScale : 1,
        partialClip: false,
        blendMode: 'screen',
        colorize: '#0cff3f',
        autoPlay: false,
        autoStop: false,
        type: $container.attr('data-type'), // img || video (the actual DOM element)
        mediaSrc: $container.attr('data-src'), // img || video file
        shape: 'star',  // one of the shapes defined in CC.shapes
        modelClass: false, // [ 'class1', 'class2', ... ]
        modelAttr: false,   // {attr1: val1, attr2: val2, ...}
        loadEvents : {
            video : 'loadeddata',
            img : 'load'
        }
    };
    if(typeof options !== 'undefined') jQuery.extend(CC.options, options);
    CC.PLAY = CC.options.autoPlay;
    CC.$object = {
        container: $container
    };
    CC.shapes = {
        circle: {},
        fullTriangle: {
            type : 'polygon',
            values : [
                [
                    {x:0, y:100},
                    {x:12.8, y:0},
                    {x:93, y:61.1},
                    {x:0, y:100}
                ]
            ]
        },
        verticalRect: {},
        deltoid: {
            type : 'polygon',
            values : [
                [
                    {x:100, y:25},
                    {x:75, y:0},
                    {x:25, y:0},
                    {x:0, y:25},
                    {x:50, y:87.5},
                    {x:100, y:25}
                ]
            ]
        },
        hollowTriangle: {
            //type : 'path',
            //values : 'M0,75.5L50,0l50,75.5H77.3L50,34.3L22.7,75.5H0z'
            type: 'polygon',
            values : [
                [
                    {x:0, y:75.5},
                    {x:50, y:0},
                    {x:100, y:75.5},
                    {x:77.3, y:75.5},
                    {x:50, y:34.3},
                    {x:22.7, y:75.5},
                    {x:0, y:75.5}
                ]
            ]
        },
        quarterCircle: {},
        halfCircle: {},
        square: {
            type : 'polygon',
            values : [
                [
                    {x:0, y:0},
                    {x:100, y:0},
                    {x:100, y:100},
                    {x:0, y:100}
                ]
            ]
        },
        doubleSlash: {
            type: 'polygon',
            values: [
                //[
                //    {x:50, y:0},
                //    {x:0, y:50},
                //    {x:14.1, y:64},
                //    {x:63.9, y:14.2}
                //],
                //[
                //    {x:86.1, y:0},
                //    {x:36.1, y:50},
                //    {x:50.2, y:64},
                //    {x:100, y:14.2}
                //]
                [
                    {x:50, y:0},
                    {x:0, y:50},
                    {x:14.1, y:64},
                    {x:63.9, y:14.2},

                    {x:86.1, y:0},
                    {x:36.1, y:50},
                    {x:50.2, y:64},
                    {x:100, y:14.2},

                    {x:86.1, y:0},
                    {x:63.9, y:14.2}
                ]
            ]
        },
        general: {
            type : 'polygon',
            values : [
                //[
                //    {x:50, y:35.8},
                //    {x:0, y:0},
                //    {x:0, y:27.4},
                //    {x:50, y:63.2},
                //    {x:100, y:27.4},
                //    {x:100, y:0}
                //],
                //[
                //    {x:50, y:72.6},
                //    {x:0, y:36.8},
                //    {x:0, y:64.2},
                //    {x:50, y:100},
                //    {x:100, y:64.2},
                //    {x:100, y:36.8}
                //]
                [
                    {x:50, y:35.8},
                    {x:0, y:0},
                    {x:0, y:27.4},
                    {x:50, y:63.2},

                    {x:50, y:72.6},
                    {x:0, y:36.8},
                    {x:0, y:64.2},
                    {x:50, y:100},
                    {x:100, y:64.2},
                    {x:100, y:36.8},


                    {x:50, y:72.6},
                    {x:50, y:63.2},


                    {x:100, y:27.4},
                    {x:100, y:0}
                ]
            ]
        },
        tripleRect: {
            type : 'polygon',
            values: [
                //[
                //    {x:0, y:0},
                //    {x:28.6, y:0},
                //    {x:28.8, y:82.6},
                //    {x:0, y:82.6}
                //],
                //[
                //    {x:35.7, y:0},
                //    {x:64.3, y:0},
                //    {x:64.3, y:82.6},
                //    {x:35.7, y:82.6}
                //],
                //[
                //    {x:71.4, y:0},
                //    {x:100, y:0},
                //    {x:100, y:82.6},
                //    {x:71.4, y:82.6}
                //]

                [
                    {x:0, y:0},
                    {x:0, y:82.6},
                    {x:28.8, y:82.6},
                    {x:28.6, y:0},

                    {x:35.7, y:0},
                    {x:35.7, y:82.6},
                    {x:64.3, y:82.6},
                    {x:64.3, y:0},

                    {x:71.4, y:0},
                    {x:71.4, y:82.6},
                    {x:100, y:82.6},
                    {x:100, y:0},

                    {x:0, y:0}
                ]
            ]
        },
        pentagon: {
            type: 'polygon',
            values: [
                [
                    {x:94.9, y:81.2},
                    {x:36.1, y:100},
                    {x:0, y:49.8},
                    {x:36.5, y:0},
                    {x:95.1, y:19.4},
                    {x:94.9, y:81.2}
                ]
            ]
        },
        star: {
            type : 'polygon',
            values : [
                [
                    {x:43.5, y:0},
                    {x:32.8, y:33.7},
                    {x:0, y:43.6},
                    {x:27.5, y:64.6},
                    {x:26.5, y:100},
                    {x:54.2, y:79.3},
                    {x:86.3, y:91.3},
                    {x:76,y: 57.5},
                    {x:96.9, y:29.5},
                    {x:62.7, y:29.3}
                ]
            ]
        },
        functions : {
            polygon : {
                draw: function(ctx, paths) {
                    //console.log('Draw Polygon', points);
                    ctx.save();
                    ctx.beginPath();

                    for(var i=0; i < paths.length; i++) {

                        if(i > 0) {// shape consists of more than one polygon path // which must not happen b/c the clipping won't work
                            //console.log('DRAWING SHAPE PATH NO. '+i);
                            ctx.closePath();
                            ctx.clip();
                            CC.draw();
                            ctx.restore();
                            ctx.save();
                            ctx.beginPath();
                        }// endif

                        var points = paths[i];
                        for(var j=0; j < points.length; j++) {
                            if(j <= 0) { // begin Path
                                ctx.moveTo(points[j].x, points[j].y);
                            } else { // then draw lines
                                ctx.lineTo(points[j].x, points[j].y);
                            }// endif
                        }// endfor points

                    }// endfor paths

                    ctx.closePath();
                },// draw()
                getShapeDimensions: function() {
                    var shapeWidth=0, shapeHeight= 0, paths = CC.shapes[CC.options.shape].values;

                    for(var i=0; i<paths.length; i++) {
                        var points = paths[i];
                        for(var j=0; j < points.length; j++) {
                            if(points[j].x > shapeWidth) { shapeWidth = points[j].x; }
                            if(points[j].y > shapeHeight) { shapeHeight = points[j].y; }
                        }// endfor points
                    }// endfor paths

                    CC.shapes[CC.options.shape].originalSize = {
                        width: shapeWidth,
                        height: shapeHeight
                    };
                },// getShapeDimensions
                recalculateValues: function() {
                    // Recalculate Point coordinates to keep the shape centered in all scales
                    // scaleRatio : used for sizing (ratio of shape's original size to the viewport)
                    CC.SHAPE.scaleRatio = Math.min(CC.DOM.canvas.object.width/CC.SHAPE.originalSize.width, CC.DOM.canvas.object.height/CC.SHAPE.originalSize.height) * CC.options.shapeScale;
                    CC.SHAPE.relativeSize = {
                        width:  CC.SHAPE.originalSize.width * CC.SHAPE.scaleRatio,
                        height:  CC.SHAPE.originalSize.height * CC.SHAPE.scaleRatio
                    };
                    CC.SHAPE.relativeSize.x = (CC.DOM.canvas.object.width - CC.SHAPE.relativeSize.width)*.5;
                    CC.SHAPE.relativeSize.y = (CC.DOM.canvas.object.height - CC.SHAPE.relativeSize.height)*.5;

                    var paths = CC.shapes[CC.options.shape].values;
                    for(var i=0; i < paths.length; i++) {
                        var points = paths[i];
                        for(var j=0; j < points.length; j++) {
                            CC.SHAPE.values[i][j].x = ( points[j].x * CC.SHAPE.scaleRatio ) + ( CC.DOM.canvas.object.width * .5 - CC.SHAPE.relativeSize.width *.5 );
                            CC.SHAPE.values[i][j].y = ( points[j].y * CC.SHAPE.scaleRatio ) + ( CC.DOM.canvas.object.height * .5 - CC.SHAPE.relativeSize.height *.5 );
                        }// endfor points

                    }// endfor paths
                }// recalculateValues
            },
            path: {
                draw: function(ctx, values) {

                    var p = new Path2D(values);
                    p.closePath();

                }, // draw(),
                getShapeDimensions: function() {
                },// getShapeDimensions
                recalculateValues: function() {
                }// recalculateValues
            },
            circle : {

            }
        }
    };

    CC.playVideo = function() {
        if(CC.options.type !== 'video') return false;
        CC.DOM.model.object.play();
        CC.PLAY = true;

        drawClippingShape();
        //console.log(
        //    'shape size on video',
        //    {width:(CC.SHAPE.relativeSize.width / CC.RATIO),
        //        height:(CC.SHAPE.relativeSize.height / CC.RATIO)},'\n',
        //    'shape size on canvas',
        //    CC.SHAPE.relativeSize,'\n',
        //    CC.RATIO
        //);
        CC.drawVideo();
    };

    CC.stopVideo = function() {
        if(CC.options.type !== 'video') return false;
        CC.DOM.model.object.pause();
        CC.PLAY = false;
    };

    CC.drawVideo = function() {
        //console.log('playing!');
        //console.log('context', ctx);
        if(CC.DOM.model.object.paused || CC.DOM.model.object.ended || !CC.PLAY) return false;

        if(CC.options.partialClip) {
            //CC.DOM.canvas.context.clearRect(0, 0, CC.DOM.canvas.object.width, CC.DOM.canvas.object.height);
            jQuery(window).resize(); // needed to clear the clipping shape
            //console.log('drawWholeVideo');
            //CC.DOM.canvas.context.globalCompositeOperation = 'source-over';
            CC.draw();
            CC.DOM.canvas.context.globalCompositeOperation = 'screen';//CC.options.blendMode;

            rasterize(0, 0, CC.DOM.canvas.object.width, CC.DOM.canvas.object.height);
        }

        //rotateContext(CC.DOM.canvas.context,.3);
        if(CC.redrawShape === true) {
            //console.log('----- REDRAW CLIPPING MASK');
            drawClippingShape();
            CC.redrawShape = false;
        }// endif

        // Draw only the area the size of the clipping shape
        CC.DOM.canvas.context.drawImage(
            CC.DOM.model.object,
            //0,0,CC.DOM.canvas.object.width,CC.DOM.canvas.object.height

            // 1. Define clipped area on original
            // must reverse-compute coordinates to original video size -> hence / CC.RATIO

            // start clip x
            ( (CC.DOM.canvas.object.width *.5  - CC.SHAPE.relativeSize.width *.5) / CC.RATIO),
            // start clip y
            ( (CC.DOM.canvas.object.height *.5 - CC.SHAPE.relativeSize.height *.5 ) / CC.RATIO),
            // clip width
            (CC.SHAPE.relativeSize.width / CC.RATIO),
            // clip height
            (CC.SHAPE.relativeSize.height / CC.RATIO),

            // 2. Draw defined area on canvas
            // using canvas coordinates

            // position clip x
            ( CC.DOM.canvas.object.width *.5 - CC.SHAPE.relativeSize.width *.5 ),
            // position clip y
            ( CC.DOM.canvas.object.height *.5 - CC.SHAPE.relativeSize.height *.5 ),
            // clip width
            (CC.SHAPE.relativeSize.width),
            // clip height
            (CC.SHAPE.relativeSize.height)
        );
        //CC.draw();

        if(CC.options.autoStop) {
            CC.stopVideo();
        }

        requestAnimationFrame( CC.drawVideo );

    };// drawVideo()

    CC.draw = function() {

        CC.DOM.canvas.context.drawImage(CC.DOM.model.object, 0, 0, CC.DOM.canvas.object.width, CC.DOM.canvas.object.height);

    };// draw()

    CC.textureImg = new Image();
    CC.textureImg.onload = function() {
        init();
    };
    CC.textureImg.src = 'assets/images/textures/texture-halftone-compressor-2-70k.jpg';


    function createCanvas() {

        CC.$object.canvas = jQuery('<canvas/>');
        CC.$object.model = jQuery('<'+ CC.options.type +' src="'+ CC.options.mediaSrc +'"/>');
        if(CC.options.modelClass) CC.$object.model.addClass(CC.options.modelClass.join(' '));
        if(CC.options.modelAttr) {
            for(var attr in CC.options.modelAttr) {
                CC.$object.model.attr(attr, CC.options.modelAttr[attr]);
            }// endfor
        }// endif

        CC.DOM = {
            canvas : {
                object: CC.$object.canvas.get(0),
                context: CC.$object.canvas.get(0).getContext('2d')
            },
            model : {
                object : CC.$object.model.get(0)
            }
        };

        CC.PATTERN = CC.DOM.canvas.context.createPattern(CC.textureImg,"repeat");

        CC.DOM.model.object.load();

        CC.DOM.model.object.addEventListener(CC.options.loadEvents[CC.options.type], function() {
            //console.log('THE MODEL RATIO: ', CC.DOM.model.object.ratio);
            var onComplete;

            CC.$object.container.append(CC.$object.canvas);
            CC.$object.container.append(CC.$object.model);
            jQuery(window).trigger('resize');

            GradientMaps.applyGradientMap(CC.DOM.canvas.object, '#101f37, #483b30');

            switch(CC.options.type) {
                case 'video' :

                    CC.DOM.model.size = {
                        width: CC.DOM.model.object.videoWidth,
                        height: CC.DOM.model.object.videoHeight
                    };
                    //console.log('DOM MODEL LOADED => SIZE', CC.DOM.model.size);

                    //CC.DOM.model.object.ratio = CC.$object.container.width / CC.DOM.model.object.videoWidth;
                    CC.DOM.model.object.volume = 0;
                    //CC.DOM.canvas.object.width = CC.DOM.model.object.videoWidth;
                    //CC.DOM.canvas.object.height = CC.DOM.model.object.videoHeight;
                    CC.DOM.model.object.addEventListener('ended', function() {
                        CC.playVideo();
                    });

                    if(CC.options.autoPlay) {
                        onComplete = function() {
                            CC.playVideo();
                        };

                        //setTimeout(function() {
                        //    CC.stopVideo();
                        //    console.log('------------------------------- VIDEO STOPPED');
                        //}, 400);
                    }

                    break;

                case 'img' :

                    CC.DOM.model.size = {
                        width: CC.DOM.model.object.naturalWidth,
                        height: CC.DOM.model.object.naturalHeight
                    };

                    CC.DOM.model.ratio = CC.$object.container.width / CC.DOM.model.object.width;
                    //CC.DOM.canvas.context.drawImage(CC.DOM.model.object, 0, 0, CC.DOM.canvas.width, CC.DOM.canvas.height);
                    CC.draw();

                    break;

            }// endswitch;

            CC.DOM.model.size.ratio = CC.DOM.model.size.width / CC.DOM.model.size.height;
            get_sizes();

            if(_.isFunction(onComplete)) onComplete();
        });

        //console.log('canvas created');

    }// createCanvas()

    function drawClippingShape() {
        //return false;
        if(!CC.options.shape) return false;
        //console.log('drawClippingShape()', CC.SHAPE);
        // clear the canvas to avoid remains of the old shape being visible
        //CC.DOM.canvas.context.clearRect(0, 0, CC.DOM.canvas.object.width, CC.DOM.canvas.object.height);
        // call the shape type's draw function
        CC.shapes.functions[ CC.SHAPE.type ][ 'draw' ]( CC.DOM.canvas.context, CC.SHAPE.values );
        // clip the canvas to the shape
        CC.DOM.canvas.context.clip();
        colorize();
        rasterize(CC.SHAPE.relativeSize.x, CC.SHAPE.relativeSize.y, CC.SHAPE.relativeSize.width, CC.SHAPE.relativeSize.height);
    }// drawClippingShape

    function colorize() {
        return false;
        if(!CC.options.colorize) return false;
        CC.DOM.canvas.context.globalCompositeOperation = CC.options.blendMode;
        CC.DOM.canvas.context.fillStyle = CC.options.colorize;
        CC.DOM.canvas.context.fillRect(CC.SHAPE.relativeSize.x, CC.SHAPE.relativeSize.y, CC.SHAPE.relativeSize.width, CC.SHAPE.relativeSize.height)
    }// colorize()
    function rasterize(x, y, width, height) {
        return false;
        CC.DOM.canvas.context.globalCompositeOperation = 'multiply';// multiply
        CC.DOM.canvas.context.rect(x, y, width, height);
        CC.DOM.canvas.context.fillStyle = CC.PATTERN;
        CC.DOM.canvas.context.fill();
    }

    function rotateContext(ctx, radians) {
        ctx.save(); // saves the coordinate system
        ctx.translate(ctx.canvas.width *.5, ctx.canvas.height *.5);
        ctx.rotate(radians);
    }// rotateContext()

    function get_sizes() {
        //console.log('get_sizes()');
        //CC.window = {
        //    width: window.innerWidth,
        //    height: window.innerHeight
        //};

        if(typeof CC.DOM.model.size === 'undefined') return false;

        // the ratio to scale the canvas in order to 'cover' its parent
        //console.log('RAIOT PARAMS' , CC.$object.canvas.parent().width(), CC.DOM.model.size.width, CC.$object.canvas.parent().height(), CC.DOM.model.size.width);
        //CC.RATIO = Math.max( (CC.$object.canvas.parent().width() / CC.DOM.model.size.width), (CC.$object.canvas.parent().height() / CC.DOM.model.size.width));

        var cover = getSizeToCover({ width:CC.$object.canvas.parent().width(), height:CC.$object.canvas.parent().height() }, CC.DOM.model.size);
CC.RATIO = cover.ratio;

        CC.DOM.canvas.object.width = cover.width;//CC.DOM.model.size.width * CC.RATIO * CC.options.canvasScale;//CC.DOM.model.object.videoWidth;
        CC.DOM.canvas.object.height = cover.height;//CC.DOM.model.size.height * CC.RATIO * CC.options.canvasScale;//CC.DOM.model.object.videoHeight;
        CC.$object.canvas.css({
            position: 'absolute',
            top: cover.top,
            left: cover.left
        });

        //console.log('sizeToCover', cover);

        //CC.DOM.canvas.object = {
        //    width: CC.DOM.canvas.object.width,//CC.$object.canvas.outerWidth(),
        //    height: CC.DOM.canvas.object.height//CC.$object.canvas.outerHeight()
        //};
        //console.log(CC.DOM.canvas.object.height);

        recalculate_shape_coordinates();
        // get shape size by getting max Coordinates
    }// get_sizes()

    function get_shape_dimensions() {
        // must only be triggered once on initiation
        //console.log('get_shape_dimensions()');
        if(typeof CC.SHAPE !== 'undefined') return false;
        // get original shape size

        CC.shapes.functions[ CC.shapes[CC.options.shape]['type'] ]['getShapeDimensions']();

        CC.SHAPE = _.cloneDeep(CC.shapes[CC.options.shape]);
        //console.log('dats the shape', CC.SHAPE);
        //console.log('CC.SHAPE',CC.SHAPE);
    }// get_shape_dimensions

    function recalculate_shape_coordinates() {
        //console.log('recalculate_shape_coordinates()');
        // outsourced so points dont have to be calculated each draw cycle
        // points coordintates must be recalculated to fit the canvas size
        //console.log('CC.shapes[CC.options.shape]', CC.shapes, CC.options.shape, CC.shapes[CC.options.shape]);

        get_shape_dimensions();
        
        CC.shapes.functions[CC.SHAPE.type]['recalculateValues']();

    }// recalculate_polygon_shapes

    function getSizeToCover(parent, child) {
        var scaleFactor = Math.max( parent.width/child.width , parent.height / child.height);
        var newWidth = child.width*scaleFactor;
        var newHeight = child.height*scaleFactor;
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

    function init() {


        //console.log('ClippedCanvas', CC);

        createCanvas();

        jQuery(window).load(function() {
            //console.log('window loaded');
            jQuery(window).trigger('resize');
        }).resize(function() {
            get_sizes();
            CC.redrawShape = true;
            //CC.draw();
        });

    }// init()

};// ClippedCanvas()