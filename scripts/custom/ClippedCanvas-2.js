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
        canvasMask: true,
        partialClip: false,
        blendMode: 'screen',
        colorize: '#ff7800',
        autoPlay: false,
        autoStop: false,
        type: $container.attr('data-type'), // img || video (the actual DOM element)
        mediaSrc: $container.attr('data-src'), // img || video file
        shape: 'star',  // one of the shapes defined in CC.shapes
        modelClass: false, // [ 'class1', 'class2', ... ]
        modelAttr: false,   // {attr1: val1, attr2: val2, ...}
        shapeClass: false, // [ 'class1', 'class2', ... ]
        shapeAttr: false,   // {attr1: val1, attr2: val2, ...}
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
        circle: {
            gradientMaps: {
                full: '#000000, #6d5e79',
                shape: '#9f53e0, #d6b9db'
            }
        },
        fullTriangle: {
            type : 'polygon',
            gradientMaps: {
                full : '#000000, #34544d',
                shape : '#26a58c, #ade4d7'
            },
            values : [
                [
                    {x:0, y:100},
                    {x:12.8, y:0},
                    {x:93, y:61.1},
                    {x:0, y:100}
                ]
            ]
        },
        verticalRect: {
            gradientMaps: {
                full: '#060d26, #79515a',
                shape: '#e08585, #f7d7d7'
            }
        },
        deltoid: {
            type : 'polygon',
            gradientMaps: {
                full : '#000000, #244a4e',
                shape : '#79bebc, #d8e6e6'
            },
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
            gradientMaps: {
                full : '#000000, #244a4e',
                shape : '#6ecca3, #c5e8db'
            },
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
        arc: {
            gradientMaps: {
                full : '#151517, #3d444a',
                shape: '#d2caa0, #ffffff'
            }
        },
        halfCircle: {
            gradientMaps: {
                full: '#361314, #3f466d',
                shape: '#3d6cf3, #b9c9fb'
            }
        },
        square: {
            type : 'polygon',
            gradientMaps: {
                full: '#041341, #583332',
                shape: '#f54848, #edb1b1'
            },
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
            gradientMaps: {
                full: '#081e24, #ca7d90',
                shape : '#e68cbd, #f4dbed'
            },
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
            gradientMaps: {
                full : '#101f37, #483b30',
                shape : '#ff7800, #dfc0a4'
            },
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
            gradientMaps: {
                full: '#291c25, #313f51',
                shape : '#388292, #ffffff'
            },
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
            gradientMaps: {
                full : '#10171f, #4d2e3d',
                shape: '#9b1856, #f2c1d8'
            },
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

                        //if(i > 0) {// shape consists of more than one polygon path // which must not happen b/c the clipping won't work
                        //    //console.log('DRAWING SHAPE PATH NO. '+i);
                        //    ctx.closePath();
                        //    ctx.clip();
                        //    CC.draw();
                        //    ctx.restore();
                        //    ctx.save();
                        //    ctx.beginPath();
                        //}// endif

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
                    var shapeCSS = 'polygon(', shapeWidth=0, shapeHeight= 0, paths = CC.shapes[CC.options.shape].values;

                    for(var i=0; i<paths.length; i++) {
                        var points = paths[i];
                        for(var j=0; j < points.length; j++) {
                            if(j>0) shapeCSS += ', ';
                            shapeCSS += points[j].x + '% ' + points[j].y + '%';
                            if(points[j].x > shapeWidth) { shapeWidth = points[j].x; }
                            if(points[j].y > shapeHeight) { shapeHeight = points[j].y; }
                        }// endfor points
                    }// endfor paths

                    shapeCSS += ')';

                    CC.shapes[CC.options.shape].originalSize = {
                        width: shapeWidth,
                        height: shapeHeight
                    };

                    if(!CC.options.canvasMask) {
                        console.log('apply css mask',shapeCSS, CC.$object.shapeCanvas);
                        CC.$object.shapeCanvas.css({
                            '-webkit-clip-path' : shapeCSS,
                            'clip-path' : shapeCSS
                        });
                    }

                },// getShapeDimensions
                recalculateValues: function() {
                    // Recalculate Point coordinates to keep the shape centered in all scales
                    // scaleRatio : used for sizing (ratio of shape's original size to the viewport)
                   
                    //CC.DOM.shapeCanvas.scaleRatio = Math.min(CC.DOM.shapeCanvas.object.width/CC.SHAPE.originalSize.width, CC.DOM.shapeCanvas.object.height/CC.SHAPE.originalSize.height) * CC.options.shapeScale;
                    //CC.DOM.shapeCanvas.object = {
                    //    width:  CC.SHAPE.originalSize.width * CC.DOM.shapeCanvas.scaleRatio,
                    //    height:  CC.SHAPE.originalSize.height * CC.DOM.shapeCanvas.scaleRatio
                    //};
                    //CC.DOM.shapeCanvas.object.x = (CC.DOM.shapeCanvas.object.width - CC.DOM.shapeCanvas.object.width)*.5;
                    //CC.DOM.shapeCanvas.object.y = (CC.DOM.shapeCanvas.object.height - CC.DOM.shapeCanvas.object.height)*.5;

                    CC.DOM.shapeCanvas.scaleRatio = Math.min(CC.RATIO.width/CC.SHAPE.originalSize.width, CC.RATIO.height/CC.SHAPE.originalSize.height) * CC.options.shapeScale;
                    CC.DOM.shapeCanvas.object.width = CC.SHAPE.originalSize.width * CC.DOM.shapeCanvas.scaleRatio;
                    CC.DOM.shapeCanvas.object.height = CC.SHAPE.originalSize.height * CC.DOM.shapeCanvas.scaleRatio;

                    CC.$object.shapeCanvas.css({
                        position: 'absolute',
                        left: (window.innerWidth - CC.DOM.shapeCanvas.object.width) *.5,
                        top: (window.innerHeight - CC.DOM.shapeCanvas.object.height) *.5
                    });

                    var paths = CC.shapes[CC.options.shape].values;
                    for(var i=0; i < paths.length; i++) {
                        var points = paths[i];
                        for(var j=0; j < points.length; j++) {
                            CC.SHAPE.values[i][j].x = ( points[j].x) * CC.DOM.shapeCanvas.scaleRatio;// + ( CC.DOM.shapeCanvas.object.width * .5 - CC.DOM.shapeCanvas.object.width *.5 );
                            CC.SHAPE.values[i][j].y = ( points[j].y) * CC.DOM.shapeCanvas.scaleRatio;// + ( CC.DOM.shapeCanvas.object.height * .5 - CC.DOM.shapeCanvas.object.height *.5 );
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
        console.log(
            'model size',
            CC.DOM.model.size,'\n',
            'start clip x',
            ( (CC.RATIO.width - CC.DOM.shapeCanvas.object.width) *.5 ) / CC.RATIO.ratio,'\n',
            'start clip y',
            ( (CC.RATIO.height - CC.DOM.shapeCanvas.object.height ) *.5 ) / CC.RATIO.ratio,'\n',
            'clip width',
            (CC.DOM.shapeCanvas.object.width / CC.RATIO.ratio),'\n',
            'clip height',
            (CC.DOM.shapeCanvas.object.height / CC.RATIO.ratio),'\n',
            CC.RATIO
        );
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
            //jQuery(window).resize(); // needed to clear the clipping shape

            CC.DOM.fullCanvas.context.drawImage(
                CC.DOM.model.object,
                0,0,CC.DOM.fullCanvas.object.width,CC.DOM.fullCanvas.object.height
            );
            rasterize(0, 0, CC.DOM.shapeCanvas.object.width, CC.DOM.shapeCanvas.object.height);
        }

        if(CC.redrawShape === true) {
            //console.log('----- REDRAW CLIPPING MASK');
            drawClippingShape();
            CC.redrawShape = false;
        }// endif

        // Draw only the area the size of the clipping shape
        CC.DOM.shapeCanvas.context.drawImage(
            CC.DOM.model.object,
            //0,0,CC.DOM.shapeCanvas.object.width,CC.DOM.shapeCanvas.object.height

            // 1. Define clipped area on original
            // must reverse-compute coordinates to original video size -> hence / CC.RATIO.ratio

            // start clip x
            ( (CC.RATIO.width - CC.DOM.shapeCanvas.object.width) *.5 ) / CC.RATIO.ratio,
            // start clip y
            ( (CC.RATIO.height - CC.DOM.shapeCanvas.object.height ) *.5 ) / CC.RATIO.ratio,
            // clip width
            (CC.DOM.shapeCanvas.object.width / CC.RATIO.ratio),
            // clip height
            (CC.DOM.shapeCanvas.object.height / CC.RATIO.ratio),

            // 2. Draw defined area on canvas
            // using canvas coordinates

            // position clip x
            0,//( CC.DOM.shapeCanvas.object.width *.5 - CC.DOM.shapeCanvas.object.width *.5 ),
            // position clip y
            0,//( CC.DOM.shapeCanvas.object.height *.5 - CC.DOM.shapeCanvas.object.height *.5 ),
            // clip width
            (CC.DOM.shapeCanvas.object.width),
            // clip height
            (CC.DOM.shapeCanvas.object.height)
        );
        //CC.draw();

        if(CC.options.autoStop) {
            CC.stopVideo();
        }

        requestAnimationFrame( CC.drawVideo );

    };// drawVideo()

    CC.draw = function() {

        CC.DOM.shapeCanvas.context.drawImage(CC.DOM.model.object, 0, 0, CC.DOM.shapeCanvas.object.width, CC.DOM.shapeCanvas.object.height);

    };// draw()

    CC.textureImg = new Image();
    CC.textureImg.onload = function() {
        init();
    };
    CC.textureImg.src = 'assets/images/textures/texture-halftone-compressor-2-70k.jpg';


    function createCanvas() {

        CC.$object.shapeCanvas = jQuery('<canvas/>');
        if(CC.options.shapeClass) CC.$object.shapeCanvas.addClass(CC.options.shapeClass.join(' '));
        if(CC.options.shapeAttr) {
            for(var attr in CC.options.shapeAttr) {
                CC.$object.shapeCanvas.attr(attr, CC.options.shapeAttr[attr]);
            }// endfor
        }// endif

        CC.$object.model = jQuery('<'+ CC.options.type +' src="'+ CC.options.mediaSrc +'"/>');
        if(CC.options.modelClass) CC.$object.model.addClass(CC.options.modelClass.join(' '));
        if(CC.options.modelAttr) {
            for(var attr in CC.options.modelAttr) {
                CC.$object.model.attr(attr, CC.options.modelAttr[attr]);
            }// endfor
        }// endif

        CC.DOM = {
            shapeCanvas : {
                object: CC.$object.shapeCanvas.get(0),
                context: CC.$object.shapeCanvas.get(0).getContext('2d')
            },
            model : {
                object : CC.$object.model.get(0)
            }
        };

        CC.PATTERN = CC.DOM.shapeCanvas.context.createPattern(CC.textureImg,"repeat");

        CC.DOM.model.object.load();

        CC.DOM.model.object.addEventListener(CC.options.loadEvents[CC.options.type], function() {
            //console.log('THE MODEL RATIO: ', CC.DOM.model.object.ratio);
            var onComplete;

            if(CC.options.partialClip) {
                // add the fullscreen canvas
                CC.$object.fullCanvas = jQuery('<canvas/>');

                CC.DOM.fullCanvas = {
                    object: CC.$object.fullCanvas.get(0),
                    context: CC.$object.fullCanvas.get(0).getContext('2d')
                };
                CC.$object.container.append(CC.$object.fullCanvas);
                GradientMaps.applyGradientMap(CC.DOM.fullCanvas.object, CC.shapes[CC.options.shape].gradientMaps.full );
            }// endif

            CC.$object.container.append(CC.$object.shapeCanvas);
            CC.$object.container.append(CC.$object.model);
            //jQuery(window).resize();

            //colorize();
            GradientMaps.applyGradientMap(CC.DOM.shapeCanvas.object, CC.shapes[CC.options.shape].gradientMaps.shape);

            switch(CC.options.type) {
                case 'video' :

                    CC.DOM.model.size = {
                        width: CC.DOM.model.object.videoWidth,
                        height: CC.DOM.model.object.videoHeight
                    };
                    //console.log('DOM MODEL LOADED => SIZE', CC.DOM.model.size);

                    CC.DOM.model.object.volume = 0;
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
        if(!CC.options.canvasMask) return false;
        if(!CC.options.shape) return false;
        // call the shape type's draw function
        CC.shapes.functions[ CC.SHAPE.type ][ 'draw' ]( CC.DOM.shapeCanvas.context, CC.SHAPE.values );
        // clip the canvas to the shape
        CC.DOM.shapeCanvas.context.clip();
        rasterize(CC.DOM.shapeCanvas.object.x, CC.DOM.shapeCanvas.object.y, CC.DOM.shapeCanvas.object.width, CC.DOM.shapeCanvas.object.height);
    }// drawClippingShape

    function colorize() {
        //return false;
        //if(!CC.options.colorize) return false;
        CC.DOM.shapeCanvas.context.globalCompositeOperation = 'multiply';
        CC.DOM.shapeCanvas.context.fillStyle = CC.options.colorize;
        console.log('COLORIEZ', CC.DOM.shapeCanvas.context.fillStyle);
        CC.DOM.shapeCanvas.context.fillRect(0, 0, CC.DOM.shapeCanvas.object.width, CC.DOM.shapeCanvas.object.height)
    }// colorize()

    function rasterize(x, y, width, height) {
        return false;
        //CC.DOM.shapeCanvas.context.globalCompositeOperation = 'multiply';// multiply
        CC.DOM.shapeCanvas.context.rect(x, y, width, height);
        CC.DOM.shapeCanvas.context.fillStyle = CC.PATTERN;
        CC.DOM.shapeCanvas.context.fill();
    }

    function rotateContext(ctx, radians) {
        ctx.save(); // saves the coordinate system
        ctx.translate(ctx.canvas.width *.5, ctx.canvas.height *.5);
        ctx.rotate(radians);
    }// rotateContext()

    function get_sizes() {

        if(typeof CC.DOM.model.size === 'undefined') return false;

        // shapeCanvas & fullCanvas always have the same parent but fullCanvas may not always exist
        // so it is safe to use shapeCanvas to compute cover size & ratio
        CC.RATIO = getSizeToCover({ width:CC.$object.shapeCanvas.parent().width(), height:CC.$object.shapeCanvas.parent().height() }, CC.DOM.model.size);
console.log('CC RATIO VALUES', CC.RATIO);
        
        if(typeof CC.DOM.fullCanvas !== 'undefined') {
            CC.DOM.fullCanvas.object.width = CC.RATIO.width;
            CC.DOM.fullCanvas.object.height = CC.RATIO.height;
            CC.$object.fullCanvas.css({
                position: 'absolute',
                top: CC.RATIO.top,
                left: CC.RATIO.left
            });
        }

        recalculate_shape_coordinates();

    }// get_sizes()

    function get_shape_dimensions() {
        // must only be triggered once on initiation
        if(typeof CC.SHAPE !== 'undefined') return false;
        // get original shape size

        CC.shapes.functions[ CC.shapes[CC.options.shape]['type'] ]['getShapeDimensions']();

        CC.SHAPE = _.cloneDeep(CC.shapes[CC.options.shape]);
    }// get_shape_dimensions

    function recalculate_shape_coordinates() {

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


        console.log('ClippedCanvas', CC);

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