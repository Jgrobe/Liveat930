SQSP.functions.createEpisodeHero = function() {

    SQSP.instances.CanvasPainter = new CanvasPainter(jQuery('.landing-bg'), {
        autoPlay: true,
        //autoStop: true,
        canvasScale:.5,
        type: 'video',
        texturize: true,
        blendMode: 'overlay',
        layeredCanvas: true,
        //modelAttr: {loop:'true', muted:'false'},
        modelClass : ['clipper-model'],
        shapeClass: ['prllx-custom'],
        shapeAttr: {'data-prllx' : '.8'},
        onCreateComplete: function(Painter) {

            console.log('canvas createcomplete',Painter);


            var testClipper = new SVGClipper(Painter.$object.layerCanvas, {
                shape: Painter.$object.container.attr('data-shape'),
                maskID: 'heroClipper',
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
        if(jQuery(window).scrollTop() > SQSP.instances.CanvasPainter.$object.container.height()) {
            SQSP.instances.CanvasPainter.stopVideo();
        } else {
            if(!SQSP.instances.CanvasPainter.PLAY) SQSP.instances.CanvasPainter.playVideo();
        }
    });

};// createEpisodeHero