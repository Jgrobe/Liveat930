SQSP.functions.createPageHero = function() {

    var $canvasContainer = jQuery('.landing-bg');

    console.log('has this mofo a data-src?', $canvasContainer.hasAttr('data-src'), $canvasContainer.attr('data-src'));
    console.log('has this mofo a data-shape?', $canvasContainer.hasAttr('data-shape'), $canvasContainer.attr('data-shape'));
    if(!$canvasContainer.hasAttr('data-src')) return;

    SQSP.instances.CanvasPainter = new CanvasPainter($canvasContainer, {
        autoPlay: true,
        //autoStop: true,
        canvasScale:.5,
        type: 'video',
        texturize: true,
        blendMode: 'overlay',
        layeredCanvas: $canvasContainer.hasAttr('data-shape'),
        //modelAttr: {loop:'true', muted:'false'},
        modelClass : ['clipper-model'],
        shapeClass: ['prllx-custom'],
        shapeAttr: {'data-prllx' : '.8'},
        onCreateComplete: function(Painter) {

            console.log('------------------canvas createcomplete',Painter);

            if(!Painter.$object.container.hasAttr('data-shape')) {
                GradientMaps.applyGradientMap(Painter.DOM.layerCanvas.object, 'black, white');
                return;
            }// endif !has shape

            SQSP.instances.heroClipper = new SVGClipper(Painter.$object.layerCanvas, {
                shape: Painter.$object.container.attr('data-shape'),
                maskID: 'heroClipper',
                assetPath: location.origin + '/assets/images/shapes/',
                onInit:function(Clip){
                    console.log('svgclipper oninit',Clip);
                    GradientMaps.applyGradientMap(Painter.DOM.baseCanvas.object, Clip.shapes[Clip.options.shape].gradientMaps.full);
                    GradientMaps.applyGradientMap(Painter.DOM.layerCanvas.object, Clip.shapes[Clip.options.shape].gradientMaps.shape);
                }
            });
        }
    });

    jQuery(document).on('click', function() {
        if(SQSP.instances.CanvasPainter.PLAY){
            SQSP.instances.CanvasPainter.stopVideo();
        } else {
            SQSP.instances.CanvasPainter.playVideo();
        }
    });

    jQuery(window).scroll(function() {
        var scrolltop = jQuery(window).scrollTop();
        if(scrolltop > SQSP.instances.CanvasPainter.$object.container.height()) {
            SQSP.instances.CanvasPainter.stopVideo();
        } else {
            TweenMax.set($canvasContainer, {y:scrolltop});
            if(!SQSP.instances.CanvasPainter.PLAY) SQSP.instances.CanvasPainter.playVideo();
        }
    });

};// createPageHero