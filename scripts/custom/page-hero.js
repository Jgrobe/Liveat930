SQSP.functions.createPageHero = function() {


    SQSP.$objects.siteHero = jQuery('.episodes-landing');
    if(!elem_exists(SQSP.$objects.siteHero)) return false;


    var $modelContainer = SQSP.$objects.siteHero.find('.landing-bg');

    SQSP.instances.CanvasPainter = new CanvasPainter($modelContainer, $modelContainer.find('video'), {
        //autoPlay: false,
        //autoStop: true,
        canvasScale:.5,
        type: 'video',
        //modelAttr: {loop:'true', muted:'false'},
        canvasClass: ['prllx-custom'],
        canvasAttr: {'data-prllx' : '.8'},
        onCreateComplete: function(Painter) {

            //console.log('clip this');

            var canvasClipper = new SVGClipper(Painter.$object.canvasWrapper, {
                shape:$modelContainer.attr('data-shape'),
                maskID: 'heroClipper',
                //shapeScale:.45,
                onInit:function(Clip){
                    //console.log('map this', Clip);
                    //GradientMaps.applyGradientMap(Painter.DOM.baseCanvas.object, Clip.shapes[Clip.options.shape].gradientMaps.full);
                    //GradientMaps.applyGradientMap(Clip.$object.container.get(0), Clip.shapes[Clip.options.shape].gradientMaps.shape);
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

};// createPageHero