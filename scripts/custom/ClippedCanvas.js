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
                [
                    {x:50, y:0},
                    {x:0, y:50},
                    {x:14.1, y:64},
                    {x:63.9, y:14.2}
                ],
                [
                    {x:86.1, y:0},
                    {x:36.1, y:50},
                    {x:50.2, y:64},
                    {x:100, y:14.2}
                ]
            ]
        },
        general: {
            type : 'polygon',
            values : [
                [
                    {x:50, y:35.8},
                    {x:0, y:0},
                    {x:0, y:27.4},
                    {x:50, y:63.2},
                    {x:100, y:27.4},
                    {x:100, y:0}
                ],
                [
                    {x:50, y:72.6},
                    {x:0, y:36.8},
                    {x:0, y:64.2},
                    {x:50, y:100},
                    {x:100, y:64.2},
                    {x:100, y:36.8}
                ]
            ]
        },
        tripleRect: {
            type : 'polygon',
            values: [
                [
                    {x:0, y:0},
                    {x:28.6, y:0},
                    {x:28.8, y:82.6},
                    {x:0, y:82.6}
                ],
                [
                    {x:35.7, y:0},
                    {x:64.3, y:0},
                    {x:64.3, y:82.6},
                    {x:35.7, y:82.6}
                ],
                [
                    {x:71.4, y:0},
                    {x:100, y:0},
                    {x:100, y:82.6},
                    {x:71.4, y:82.6}
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

                        if(i > 0) {// more than one polygon shape
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
                    var scaleRatio = Math.min(CC.DOM.canvas.object.width/CC.SHAPE.originalSize.width, CC.DOM.canvas.object.height/CC.SHAPE.originalSize.height);
                    //var scaleRatioX = CC.DOM.canvas.object.width/CC.SHAPE.originalSize.width;
                    //var scaleRatioY = CC.DOM.canvas.object.height/CC.SHAPE.originalSize.height;
                    //var scaleRatio = CC.DOM.canvas.object.height * CC.SHAPE.originalSize.height / 100;// assuming the video's aspect ratio = horizontal
                    //console.log('dat ratio tho '+CC.SHAPE.originalSize.height+' / '+CC.DOM.canvas.object.height, scaleRatio);
                    var paths = CC.shapes[CC.options.shape].values;
                    for(var i=0; i < paths.length; i++) {
                        var points = paths[i];
                        for(var j=0; j < points.length; j++) {
                            CC.SHAPE.values[i][j].x = ( points[j].x * scaleRatio ) + (CC.DOM.canvas.object.width * .5) - ( (CC.SHAPE.originalSize.width * scaleRatio) *.5 );
                            CC.SHAPE.values[i][j].y = ( points[j].y * scaleRatio );
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
            }
        }
    };

    CC.playVideo = function() {
        if(CC.options.type !== 'video') return false;
        console.log('--------------------------------- Playing Video!');
        CC.DOM.model.object.play();
        CC.PLAY = true;

        CC.drawVideo();
    };

    CC.stopVideo = function() {
        if(CC.options.type !== 'video') return false;
        console.log('--------------------------------- Stopping Video!');
        CC.DOM.model.object.pause();
        CC.PLAY = false;
    };

    init();

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

        CC.DOM.model.object.load();

        var fn_on_model_loaded;
        switch(CC.options.type) {
            case 'video' :
                fn_on_model_loaded = function() {
                    CC.DOM.model.object.ratio = CC.$object.container.width / CC.DOM.model.object.videoWidth;
                    CC.DOM.model.object.volume = 0;
                    //CC.DOM.canvas.object.width = CC.DOM.model.object.videoWidth;
                    //CC.DOM.canvas.object.height = CC.DOM.model.object.videoHeight;

                    if(CC.options.autoPlay) {
                        CC.playVideo();

                        //setTimeout(function() {
                        //    CC.stopVideo();
                        //    console.log('------------------------------- VIDEO STOPPED');
                        //}, 400);
                    }

                };// fn_on_model_loaded()

                break;

            case 'img' :
                fn_on_model_loaded = function() {
                    CC.DOM.model.ratio = CC.$object.container.width / CC.DOM.model.object.width;
                    //CC.DOM.canvas.context.drawImage(CC.DOM.model.object, 0, 0, CC.DOM.canvas.width, CC.DOM.canvas.height);
                    CC.draw();
                };// fn_on_model_loaded
                break;

        }// endswitch;

        CC.DOM.model.object.addEventListener(CC.options.loadEvents[CC.options.type], function() {
            //console.log('THE MODEL RATIO: ', CC.DOM.model.object.ratio);
            CC.$object.container.append(CC.$object.canvas);
            CC.$object.container.append(CC.$object.model);
            jQuery(window).trigger('resize');
            fn_on_model_loaded();
        });

        //console.log('canvas created');

    }// createCanvas()

    CC.drawVideo = function() {
        //console.log('playing!');
        //console.log('context', ctx);
        if(CC.DOM.model.object.paused || CC.DOM.model.object.ended || !CC.PLAY) return false;


        drawClippingShape();
        //rotateContext(CC.DOM.canvas.context,.3);
        CC.draw();
        console.log('--------------------------------- Video Drawn!', CC.options.mediaSrc);

        if(CC.options.autoStop) {
            CC.stopVideo();
        }

        requestAnimationFrame( CC.drawVideo );

    };// drawVideo()

    CC.draw = function() {

        CC.DOM.canvas.context.drawImage(CC.DOM.model.object, 0, 0, CC.DOM.canvas.object.width, CC.DOM.canvas.object.height);

    };// draw()

    function drawClippingShape() {
        if(!CC.options.shape) return false;
        //console.log('drawClippingShape()', CC.SHAPE);
        // clear the canvas to avoid remains of the old shape being visible
        //CC.DOM.canvas.context.clearRect(0, 0, CC.DOM.canvas.object.width, CC.DOM.canvas.object.height);
        // call the shape type's draw function
        CC.shapes.functions[ CC.SHAPE.type ][ 'draw' ]( CC.DOM.canvas.context, CC.SHAPE.values );
        // clip the canvas to the shape
        CC.DOM.canvas.context.clip();
    }// drawClippingShape

    function rotateContext(ctx, radians) {
        ctx.save(); // saves the coordinate system
        ctx.translate(ctx.canvas.width *.5, ctx.canvas.height *.5);
        ctx.rotate(radians);
    }// rotateContext()

    function get_sizes() {
        //console.log('get_sizes()');
        CC.DOM.canvas.object.width = CC.$object.canvas.parent().width() * CC.options.canvasScale;//CC.DOM.model.object.videoWidth;
        CC.DOM.canvas.object.height = CC.$object.canvas.parent().height() * CC.options.canvasScale;//CC.DOM.model.object.videoHeight;

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

    function init() {


        console.log('ClippedCanvas', CC);

        createCanvas();

        jQuery(window).load(function() {
            //console.log('window loaded');
            jQuery(window).trigger('resize');
        }).resize(function() {
            get_sizes();
            //CC.draw();
        });

    }// init()

};// ClippedCanvas()