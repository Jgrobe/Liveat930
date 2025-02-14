var SVGClipper = function($container, options) {
    if(typeof $container === 'undefined') return;
    if(typeof options === 'undefined') options = {};
    var SC = this;
    SC.options = jQuery.extend({
        autoInit : true,
        shape : 'star',
        maskID : 'shapeMask',
        onInit : false,
        imgSrc: $container.attr('data-img'),
        shapeScale: 1,
        assetPath : 'assets/images/shapes/',
        ieSVGSelector : '.clip-svg',
        ieImageSelector : '.svg-image'
    }, options);

    SC.$object = {
        container : $container,
        ieSVG : $container.find(SC.options.svgSelector),
        ieImage : $container.find(SC.options.ieImageSelector)
    };
    SC.DOM = {
        container : {
            object : SC.$object.container.get(0)
        }
    };// DOM

    SC.shapes = {
        circle: {
            type: 'circle',
            gradientMaps: {
                full: '#000000, #6d5e79',
                shape: '#9f53e0, #d6b9db'
            },
            values: {
                cx:.5,
                cy:.5,
                r:.5
            }
        },
        fullTriangle: {
            type : 'path',
            gradientMaps: {
                full : '#000000, #34544d',
                shape : '#26a58c, #ade4d7'
            },
            values : 'M0,100L12.8,0L93,61.1L0,100z'
            //[
            //    [
            //        {x:0, y:1},
            //        {x:.128, y:0},
            //        {x:.93, y:.611},
            //        {x:0, y:1}
            //    ]
            //]
        },
        verticalRect: {
            type : 'path',
            gradientMaps: {
                full: '#060d26, #79515a',
                shape: '#e08585, #f7d7d7'
            },
            values : 'M0,0L100 0 100 170 0 170z'
        },
        deltoid: {
            type : 'path',
            gradientMaps: {
                full : '#000000, #244a4e',
                shape : '#79bebc, #d8e6e6'
            },
            values : 'M100,25L75,0H25L0,25l50,62.5L100,25z'
            //[
            //    [
            //        {x:1, y:.25},
            //        {x:.75, y:0},
            //        {x:.25, y:0},
            //        {x:0, y:.25},
            //        {x:.5, y:.875},
            //        {x:.1, y:.25}
            //    ]
            //]
        },
        hollowTriangle: {
            type: 'path',
            gradientMaps: {
                full : '#000000, #244a4e',
                shape : '#6ecca3, #c5e8db'
            },
            values : 'M0,75.5L50,0l50,75.5H77.3L50,34.3L22.7,75.5H0z'
            //[
            //    [
            //        {x:0, y:.755},
            //        {x:.5, y:0},
            //        {x:1, y:.755},
            //        {x:.773, y:.755},
            //        {x:.5, y:.343},
            //        {x:.227, y:.755},
            //        {x:0, y:.755}
            //    ]
            //]
        },
        arc: {
            type: 'path',
            gradientMaps: {
                full : '#151517, #3d444a',
                shape: '#d2caa0, #ffffff'
            },
            values: 'M95.4,0C82.5,0,70,2.5,58.3,7.5c-11.4,4.8-21.6,11.7-30.3,20.4c-8.8,8.8-15.6,19-20.4,30.3 C2.5,70,0,82.5,0,95.4v4.6h43.6v-4.6c0-28.6,23.2-51.8,51.8-51.8h4.6V0H95.4z',
            file: 'arc2.svg'
        },
        halfCircle: {
            type: 'path',
            gradientMaps: {
                full: '#361314, #3f466d',
                shape: '#3d6cf3, #b9c9fb'
            },
            values : 'M100,26.8C90.7,10.8,73.4,0,53.6,0C24,0,0,24,0,53.6c0,9.7,2.6,18.9,7.2,26.8L100,26.8z',
            file : 'halfCircle.svg'
        },
        //quarterCircle :{
        //    type : 'path',
        //    gradientMaps : {
        //        full: '#041341, #583332',
        //        shape: '#f54848, #edb1b1'
        //    },
        //    values : 'M37.9,100H0c0-13.5,2.6-26.6,7.9-38.9c5-11.9,12.2-22.6,21.4-31.8c9.2-9.2,19.9-16.4,31.8-21.4 C73.4,2.6,86.5,0,100,0v37.9C65.8,37.9,37.9,65.8,37.9,100z'
        //},
        square: {
            type : 'path',
            gradientMaps: {
                full: '#041341, #583332',
                shape: '#f54848, #edb1b1'
            },
            values : 'M0,0L100 0 100 100 0 100z'
            //[
            //    [
            //        {x:0, y:0},
            //        {x:1, y:0},
            //        {x:1, y:1},
            //        {x:0, y:1}
            //    ]
            //]
        },
        doubleSlash: {
            type: 'path',
            gradientMaps: {
                full: '#081e24, #ca7d90',
                shape : '#e68cbd, #f4dbed'
            },
            values: 'M50,0L0 50 14.1 64 63.9 14.2 86.1 0 36.1 50 50.2 64 100 14.2 86.1 0 63.9 14.2z'
            //[
            //    [
            //        {x:.5, y:0},
            //        {x:0, y:.5},
            //        {x:.141, y:.64},
            //        {x:.639, y:.142},
            //
            //        {x:.861, y:0},
            //        {x:.361, y:.5},
            //        {x:.502, y:.64},
            //        {x:1, y:.142},
            //
            //        {x:.861, y:0},
            //        {x:.639, y:.142}
            //    ]
            //]
        },
        general: {
            type : 'path',
            gradientMaps: {
                full : '#101f37, #483b30',
                shape : '#ff7800, #dfc0a4'
            },
            values : 'M50,35.8L0 0 0 27.4 50 63.2 50 72.6 0 36.8 0 64.2 50 100 100 64.2 100 36.8 50 72.6 50 63.2 100 27.4 100 0z'
            //[
            //    [
            //        {x:.5, y:.358},
            //        {x:0, y:0},
            //        {x:0, y:.274},
            //        {x:.5, y:.632},
            //
            //        {x:.5, y:.726},
            //        {x:0, y:.368},
            //        {x:0, y:.642},
            //        {x:.5, y:1},
            //        {x:1, y:.642},
            //        {x:1, y:.368},
            //
            //
            //        {x:.5, y:.726},
            //        {x:.5, y:.632},
            //
            //
            //        {x:1, y:.274},
            //        {x:1, y:0}
            //    ]
            //]
        },
        tripleRect: {
            type : 'path',
            gradientMaps: {
                full: '#291c25, #313f51',
                shape : '#388292, #ffffff'
            },
            values: 'M0,0L0 82.6 28.8 82.6 28.6 0 35.7  0 35.7  82.6 64.3  82.6 64.3  0 71.4 0 71.4 82.6 100 82.6 100 0 0 0z'
            //[
            //
            //    [
            //        {x:0, y:0},
            //        {x:0, y:.826},
            //        {x:.288, y:.826},
            //        {x:.286, y:0},
            //
            //        {x:.357, y:0},
            //        {x:.357, y:.826},
            //        {x:.643, y:.826},
            //        {x:.643, y:0},
            //
            //        {x:.714, y:0},
            //        {x:.714, y:.826},
            //        {x:1, y:.826},
            //        {x:1, y:0},
            //
            //        {x:0, y:0}
            //    ]
            //]
        },
        pentagon: {
            type: 'path',
            gradientMaps: {
                full : '#10171f, #4d2e3d',
                shape: '#9b1856, #f2c1d8'
            },
            values: 'M90.2,90.2L28.4,100L0,44.2L44.2,0L100,28.4L90.2,90.2z'
            //[
            //    [
            //        {x:.949, y:.812},
            //        {x:.361, y:1},
            //        {x:0, y:.498},
            //        {x:.365, y:0},
            //        {x:.951, y:.194},
            //        {x:.949, y:.812}
            //    ]
            //]
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

                    if( !SC.$object.inlineClippingMask.hasAttr('clipPathUnits') ) {
                        SC.$object.inlineClippingMask.attr({clipPathUnits : 'objectBoundingBox'});
                    }

                    var domObjRelativeSize = {
                        width: SC.DOM.container.size.ratio > 1 ? 1 : (SC.DOM.container.size.width/SC.DOM.container.size.height),
                        height: SC.DOM.container.size.ratio > 1 ? (SC.DOM.container.size.height/SC.DOM.container.size.width) : 1
                    };
                    //domObjRelativeSize.ratio = domObjRelativeSize.width/domObjRelativeSize.height;

                    ////console.log('SC.DOM.container.size', SC.DOM.container.size);
                    ////console.log('SC.SHAPE.originalSize', SC.SHAPE.originalSize);
                    ////console.log('domObjRelativeSize', domObjRelativeSize);

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

                        ////console.log('calc point x\n',
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
                    SC.SHAPE.originalSize = {
                        width: 100,
                        height :100,
                        ratio : 1
                    }
                },
                updateMask: function() {

                    //console.log('calc scale factor', SC.DOM.container.size, SC.SHAPE.originalSize );
                    var pathScale = getSizeTo('contain',SC.DOM.container.size, {width:100, height:100});
                    //console.log('path scale factor', SC.DOM.container.size, pathScale)//, pathTranslateX, pathTranslateY);

                    //var shapeURL = SC.options.assetPath + SC.SHAPE.file;

                    SC.$object.inlineClippingMask.attr({transform : 'scale('+ pathScale.ratio +') translate(0,0)'});

                    SC.SHAPE.ATTRIBUTES = {
                        d : SC.SHAPE.values
                    };
                    SC.SHAPE.CSS = {
                        //'mask' : 'url(' + shapeURL + '#mask)',
                        //'-webkit-mask-image' : 'url(' + shapeURL + ')'
                        'clip-path' : 'url(#'+ SC.options.maskID +')',
                        '-webkit-clip-path' : 'url(#'+ SC.options.maskID +')'
                    };
                }
            },
            circle : {
                getShapeDimensions:function() {
                    var width = SC.SHAPE.values.r* 2,
                        height = SC.SHAPE.values.r*2;
                    SC.SHAPE.originalSize = {
                        width: width,
                        height: height,
                        ratio: width/height
                    };
                },
                updateMask: function() {

                    var pathScale = getSizeTo('contain',SC.DOM.container.size, {width:100, height:100});
                    SC.$object.inlineClippingMask.attr({transform : 'scale('+ pathScale.ratio +')'});

                    SC.SHAPE.ATTRIBUTES = {
                        cx: SC.SHAPE.values.cx*100,
                        cy: SC.SHAPE.values.cy*100,
                        r : SC.SHAPE.values.r*100 * SC.options.shapeScale
                    };
                    SC.SHAPE.CSS = {
                        'clip-path' : 'url(#'+ SC.options.maskID +')',
                        '-webkit-clip-path' : 'circle('+ ( (SC.SHAPE.values.r * SC.options.shapeScale*100) +'%') +' at '+ ( (SC.SHAPE.values.cx*100) +'%') +' '+ ( (SC.SHAPE.values.cy*100) +'%') +')'
                    };
                }
            }
        }
    };// shapes

    SC.SHAPE = _.cloneDeep(SC.shapes[SC.options.shape]);

    SC.init = function() {
        if(SC.SHAPE.type === 'none') return false;
        //console.log('SVGClipper', SC);

        if (is_IE()) SC.$object.container.find('video').remove();

        SC.$object.container.css('overflow', 'hidden');

        SC.DOM.img = new Image();
        SC.DOM.img.onload = function(){

            create_clipping_mask();

        };// image onload
        SC.DOM.img.src = SC.options.imgSrc;

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

        var inlineOpener = '<svg><defs><clipPath id="'+ SC.options.maskID +'">';
        var inlineCloser = '</clipPath></defs></svg>';

        var svgHTML = inlineOpener + '<'+ SC.SHAPE.type +' />' + inlineCloser;

        SC.$object.inlineClippingSVG = jQuery( svgHTML );
        SC.$object.inlineClippingSVG.css({
            width: 0,
            height: 0
        });

        SC.$object.ieImage.css({
            'clip-path' : 'url(#'+ SC.options.maskID +')',
            '-webkit-clip-path' : 'url(#'+ SC.options.maskID +')'
        });
        
        SC.$object.inlineClippingMask = SC.$object.inlineClippingSVG.find('#'+SC.options.maskID);
        SC.$object.inlineClippingMaskElement = SC.$object.inlineClippingSVG.find(SC.SHAPE.type);
        SC.$object.inlineClippingSVG.insertAfter(SC.$object.container);

        SC.DOM.inlineClippingSVG = {object:SC.$object.inlineClippingSVG.get(0)};
        SC.DOM.inlineClippingMask = {object:SC.$object.inlineClippingMask.get(0)};
        SC.DOM.inlineClippingMaskElement = {object:SC.$object.inlineClippingMaskElement.get(0)};

        update_mask();

    }// create_clipping_mask()

    function update_mask() {

        get_sizes();

        SC.shapes.functions[SC.SHAPE.type].updateMask();

        SC.$object.inlineClippingMaskElement.attr(SC.SHAPE.ATTRIBUTES);
        SC.$object.container.css(SC.SHAPE.CSS);

        //console.log('parent', SC.$object.container.get(0));
        //console.log('cild',SC.DOM.img);

        var ieImageSize = getSizeTo('cover', {width:SC.$object.container.width(),height:SC.$object.container.height()}, SC.DOM.img);
        //console.log('------------ get svg image size', ieImageSize);
        SC.$object.ieImage.attr({
            width:ieImageSize.width,
            height:ieImageSize.height
        });

        ////console.log('MASK VALUES', SC.SHAPE.points);

    }// update_mask()

    function getSizeTo(mode, parent, child) {
        //console.log('getsizeTo parent', parent.width, parent.height);
        //console.log('getsizeTo child', child.width, child.height);

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

    function is_IE() {
        //console.log('-------- OMG THIS IS SPARTA --------');
        return (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0);
    }// is_IE()

};// SVGClipper()