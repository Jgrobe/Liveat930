SQSP.functions.initPage = function() {

    SQSP.functions.windowLoad.push(function() {
        console.log('Page Episode loaded');
    });

    SQSP.$objects.siteHero = jQuery('.episodes-landing');
    var $modelContainer = SQSP.$objects.siteHero.find('.landing-bg');
    //SQSP.instances.ClippedCanvas = new ClippedCanvas($modelContainer, {
    //    autoPlay: true,
    //    //autoStop: true,
    //    type: 'video',
    //    shapeScale:.65,
    //    blendMode: 'overlay',
    //    partialClip: true,
    //    //modelAttr: {loop:'true', muted:'false'},
    //    modelClass : ['clipper-model'],
    //    shapeClass: ['prllx-custom'],
    //    shapeAttr: {'data-prllx' : '.8'},
    //    shape: $modelContainer.attr('data-shape'),
    //    onCreateComplete: function() {
    //    }
    //});

    SQSP.instances.CanvasPainter = new CanvasPainter($modelContainer, {
        autoPlay: true,
        //autoStop: true,
        canvasScale:.5,
        type: 'video',
        blendMode: 'overlay',
        layeredCanvas: true,
        //modelAttr: {loop:'true', muted:'false'},
        modelClass : ['clipper-model'],
        shapeClass: ['prllx-custom'],
        shapeAttr: {'data-prllx' : '.8'},
        shape: $modelContainer.attr('data-shape'),
        onCreateComplete: function(Painter) {

            console.log('canvas createcomplete',Painter);


            var testClipper = new SVGClipper(Painter.$object.layerCanvas, {
                shape:'general',
                maskID: 'heroClipper',
                onInit:function(Clip){
                    console.log('svgclipper oninit',Clip);
                    GradientMaps.applyGradientMap(Painter.DOM.baseCanvas.object, Clip.shapes[Clip.options.shape].gradientMaps.full);
                    GradientMaps.applyGradientMap(Painter.DOM.layerCanvas.object, Clip.shapes[Clip.options.shape].gradientMaps.shape);
                }
            });

            //GradientMaps.applyGradientMap(CP.DOM.shapeCanvas.object, CP.shapes[CP.options.shape].gradientMaps.shape);
            //GradientMaps.applyGradientMap(CP.DOM.fullCanvas.object, CP.shapes[CP.options.shape].gradientMaps.full );
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
        if(jQuery(window).scrollTop() > SQSP.instances.CanvasPainter.$object.container.height()) {
            SQSP.instances.CanvasPainter.stopVideo();
        } else {
            if(!SQSP.instances.CanvasPainter.PLAY) SQSP.instances.CanvasPainter.playVideo();
        }
    });

};