var SVGClipper = function($container, options) {
    if(typeof $container === 'undefined') return;
    if(typeof options === 'undefined') options = {};
    var SC = this;
    SC.options = jQuery.extend({
        autoInit : true,
        shape : 'star',
        maskID : 'shapeMask',
        onInit : false,
        assetPath : 'assets/images/shapes/'
    }, options);

    SC.$object = {
        container : $container
    };
    SC.DOM = {
        container : {
            object : SC.$object.container.get(0)
        }
    };// DOM

    SC.shapes = {
        circle: {
            type: "circle",
            gradientMaps: {
                full: '#000000, #6d5e79',
                shape: '#9f53e0, #d6b9db'
            },
            values: {
                cx: 50,
                cy: 50,
                r: 50
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
                    {x:0, y:1},
                    {x:.128, y:0},
                    {x:.93, y:.611},
                    {x:0, y:1}
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
                    {x:1, y:.25},
                    {x:.75, y:0},
                    {x:.25, y:0},
                    {x:0, y:.25},
                    {x:.5, y:.875},
                    {x:.1, y:.25}
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
                    {x:0, y:.755},
                    {x:.5, y:0},
                    {x:1, y:.755},
                    {x:.773, y:.755},
                    {x:.5, y:.343},
                    {x:.227, y:.755},
                    {x:0, y:.755}
                ]
            ]
        },
        arc: {
            type: 'path',
            gradientMaps: {
                full : '#151517, #3d444a',
                shape: '#d2caa0, #ffffff'
            },
            values: 'arc2.svg'
        },
        halfCircle: {
            type: 'path',
            gradientMaps: {
                full: '#361314, #3f466d',
                shape: '#3d6cf3, #b9c9fb'
            },
            values : 'halfCircle.svg'
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
                    {x:1, y:0},
                    {x:1, y:1},
                    {x:0, y:1}
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
                    {x:.5, y:0},
                    {x:0, y:.5},
                    {x:.141, y:.64},
                    {x:.639, y:.142},

                    {x:.861, y:0},
                    {x:.361, y:.5},
                    {x:.502, y:.64},
                    {x:1, y:.142},

                    {x:.861, y:0},
                    {x:.639, y:.142}
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
                    {x:.5, y:.358},
                    {x:0, y:0},
                    {x:0, y:.274},
                    {x:.5, y:.632},

                    {x:.5, y:.726},
                    {x:0, y:.368},
                    {x:0, y:.642},
                    {x:.5, y:1},
                    {x:1, y:.642},
                    {x:1, y:.368},


                    {x:.5, y:.726},
                    {x:.5, y:.632},


                    {x:1, y:.274},
                    {x:1, y:0}
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
                    {x:0, y:.826},
                    {x:.288, y:.826},
                    {x:.286, y:0},

                    {x:.357, y:0},
                    {x:.357, y:.826},
                    {x:.643, y:.826},
                    {x:.643, y:0},

                    {x:.714, y:0},
                    {x:.714, y:.826},
                    {x:1, y:.826},
                    {x:1, y:0},

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
                    {x:.949, y:.812},
                    {x:.361, y:1},
                    {x:0, y:.498},
                    {x:.365, y:0},
                    {x:.951, y:.194},
                    {x:.949, y:.812}
                ]
            ]
        },
        star: {
            type : 'polygon',
            gradientMaps: {
                full : 'black, white',
                shape: 'red, blue'
            },
            values : [
                [
                    {x:.435, y:0},
                    {x:.328, y:.337},
                    {x:0, y:.436},
                    {x:.275, y:.646},
                    {x:.265, y:1},
                    {x:.542, y:.793},
                    {x:.863, y:.913},
                    {x:.76,y: .575},
                    {x:.969, y:.295},
                    {x:.627, y:.293}
                ]
            ]
        },
        functions : {
            polygon : {
                computePoints:function(func) {
                    var paths = SC.shapes[SC.options.shape].values;

                    for(var i=0; i<paths.length; i++) {
                        var points = paths[i];
                        for(var j=0; j < points.length; j++) {

                            var params = {
                                index:j,
                                path:paths[i],
                                point:points[j]
                            };
                            func(params);

                        }// endfor points
                    }// endfor paths
                },
                //getPoints:function() {
                //    var paths = SC.shapes[SC.options.shape].values;
                //
                //    for(var i=0; i<paths.length; i++) {
                //        var points = paths[i];
                //        for(var j=0; j < points.length; j++) {
                //
                //            //func({index:j,path:paths[i],point:points[j]});
                //
                //            if(j > 0) {
                //                SC.SHAPE.points.inline += ' ';
                //                SC.SHAPE.points.css += ', ';
                //            }
                //            SC.SHAPE.points.inline += (points[j].x * .01) + ',' + (points[j].y * .01);
                //            SC.SHAPE.points.css += points[j].x + '% ' + points[j].y + '%';
                //
                //        }// endfor points
                //    }// endfor paths
                //},
                //getShapeHTML: function() {
                //    var shapeHTML = '<polygon points="'+ SC.SHAPE.points.inline +'" />';
                //    return shapeHTML;
                //},
                getShapeDimensions:function() {
                    var width= 0, height=0;
                    SC.shapes.functions.polygon.computePoints(function(e){
                        if(e.point.x > width) width = e.point.x;
                        if(e.point.y > height) height = e.point.y;
                    });
                    SC.SHAPE.originalSize = {
                        width: width,
                        height: height,
                        ratio: width/height
                    };
                },
                updateMask: function() {

                    var domObjRelativeSize = {
                        width: SC.DOM.container.size.ratio > 1 ? 1 : (SC.DOM.container.size.width/SC.DOM.container.size.height),
                        height: SC.DOM.container.size.ratio > 1 ? (SC.DOM.container.size.height/SC.DOM.container.size.width) : 1
                    };
                    //domObjRelativeSize.ratio = domObjRelativeSize.width/domObjRelativeSize.height;

                    //console.log('SC.DOM.container.size', SC.DOM.container.size);
                    //console.log('SC.SHAPE.originalSize', SC.SHAPE.originalSize);
                    //console.log('domObjRelativeSize', domObjRelativeSize);

                    var shapeRelativePosition = getSizeTo('contain',domObjRelativeSize, SC.SHAPE.originalSize);

                    SC.SHAPE.points = {
                        inline : '',
                        css: ''
                    };

                    SC.shapes.functions.polygon.computePoints(function(e){
                        if(e.index > 0) {
                            SC.SHAPE.points.inline += ' ';
                            SC.SHAPE.points.css += ', ';
                        }

                        //console.log('calc point x\n',
                        //    'point x: '+ e.point.x +'\n',
                        //    'point x ratio: '+ e.point.x*shapeRelativePosition.ratio +'\n',
                        //    'relative container width: '+ domObjRelativeSize.width +'\n',
                        //    'relative shape left: '+ shapeRelativePosition.left +'\n'
                        //);
                        var point = {
                            x : e.point.x*(SC.DOM.container.size.ratio > 1 ? shapeRelativePosition.ratio : 1) + shapeRelativePosition.left,// + shapeRelativePosition.left,//(SC.DOM.container.size.ratio > 1 ? (.5*SC.SHAPE.originalSize.ratio) : 0 ),
                            y : e.point.y*(SC.DOM.container.size.ratio > 1 ? 1 :  shapeRelativePosition.ratio) + shapeRelativePosition.top// + shapeRelativePosition.top// + .5 - (.5 * (SC.DOM.container.size.ratio > 1 ? 1 : (SC.SHAPE.originalSize.width / SC.DOM.container.size.width) ) )
                        };
                        SC.SHAPE.points.inline += point.x + ',' + point.y ;
                        SC.SHAPE.points.css += (point.x * 100) + '% ' + (point.y * 100) + '%';
                    });

                    SC.SHAPE.ATTRIBUTES = {
                        points: SC.SHAPE.points.inline
                    };
                    SC.SHAPE.CSS = {
                        'clip-path' : 'url(#'+ SC.options.maskID +')',
                        '-webkit-clip-path' : 'polygon('+ SC.SHAPE.points.css +')'
                    };

                }
            },
            path: {
                getShapeDimensions:function() {
                    return;
                },
                updateMask: function() {

                    if(SC.isPathApplied === true) return;// needed only once on instanciation
                    SC.isPathApplied = true;

                    var shapeURL = SC.options.assetPath + SC.SHAPE.values;

                    SC.SHAPE.ATTRIBUTES = {};
                    SC.SHAPE.CSS = {
                        'mask' : 'url(' + shapeURL + '#mask)',
                        '-webkit-mask-image' : 'url(' + shapeURL + ')'
                    };
                }
            },
            circle : {
                getShapeDimensions:function() {
                    var width = SC.SHAPE.values.r* 2, height = SC.SHAPE.values.r*2;
                    SC.SHAPE.originalSize = {
                        width: width,
                        height: height,
                        ratio: width/height
                    };
                },
                updateMask: function() {
                    SC.SHAPE.ATTRIBUTES = SC.SHAPE.values;
                    SC.SHAPE.CSS = {
                        'clip-path' : 'url(#'+ SC.options.maskID +')',
                        '-webkit-clip-path' : 'circle('+ (SC.SHAPE.values.r+'%') +' at '+ (SC.SHAPE.values.cx+'%') +' '+ (SC.SHAPE.values.cy+'%') +')'
                    };
                }
            }
        }
    };// shapes

    SC.SHAPE = _.cloneDeep(SC.shapes[SC.options.shape]);


    SC.init = function() {
        //console.log('SVGClipper', SC);

        create_clipping_mask();

        jQuery(window).load(function(){
            jQuery(window).resize();
        }).resize(function() {
            update_mask();
        });

        if(_.isFunction(SC.options.onInit)) SC.options.onInit(SC);

    };// init()

    if(SC.options.autoInit) SC.init();

    function get_sizes() {
        SC.DOM.container.size = {
            width: SC.$object.container.width(),
            height: SC.$object.container.height()
        };
        SC.DOM.container.size.ratio = SC.DOM.container.size.width/SC.DOM.container.size.height;
        //console.log('SC.DOM.container.size', SC.DOM.container.size);
    }// get_sizes()

    function get_shape_dimensions() {

        if(typeof SC.SHAPE.originalSize !== 'undefined') return false;// only run once
        SC.shapes.functions[SC.SHAPE.type].getShapeDimensions();
    }

    function create_clipping_mask() {

        get_shape_dimensions();

        var inlineOpener = '<svg><defs><clipPath id="'+ SC.options.maskID +'" clipPathUnits="objectBoundingBox">',
            inlineCloser = '</clipPath></defs></svg>';

        var svgHTML = inlineOpener + '<'+ SC.SHAPE.type +' />' + inlineCloser;

        SC.$object.inlineClippingMask = jQuery( svgHTML );
        SC.$object.inlineClippingMaskElement = SC.$object.inlineClippingMask.find(SC.SHAPE.type);
        SC.$object.inlineClippingMask.insertAfter(SC.$object.container);

        SC.DOM.inlineClippingMask = {object:SC.$object.inlineClippingMask.get(0)};
        SC.DOM.inlineClippingMaskElement = {object:SC.$object.inlineClippingMaskElement.get(0)};

        update_mask();

    }// create_clipping_mask()

    function update_mask() {

        get_sizes();

        SC.shapes.functions[SC.SHAPE.type].updateMask();

        SC.$object.inlineClippingMaskElement.attr(SC.SHAPE.ATTRIBUTES);
        SC.$object.container.css(SC.SHAPE.CSS);

        //console.log('MASK VALUES', SC.SHAPE.points);

    }// update_mask()

    function getSizeTo(mode, parent, child) {

        var scaleFactor;
        switch(mode) {
            case 'cover' :
                scaleFactor = Math.max( parent.width/child.width , parent.height / child.height);
                break;
            case 'contain' :
                scaleFactor = Math.min( parent.width/child.width , parent.height / child.height);
                break;
        }
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

};// SVGClipper()