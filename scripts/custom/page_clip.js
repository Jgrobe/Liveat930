SQSP.functions.initPage = function() {

    //console.log('init clip detail page');

    SQSP.instances.shapes = [];
    jQuery('.make-shape').each(function(i) {
        var $this = jQuery(this);

        SQSP.instances.shapes.push(new SVGClipper($this, {
            shape: $this.attr('data-shape'),
            maskID: ('clip_'+i),
            onInit:function(Clip){
                //console.log('svgclipper oninit',Clip);
                //GradientMaps.applyGradientMap(Painter.DOM.baseCanvas.object, Clip.shapes[Clip.options.shape].gradientMaps.full);
                //GradientMaps.applyGradientMap(Clip.$object.container.find('.gradmap').get(0), Clip.SHAPE.gradientMaps.shape);
            }
        }));
    });

    jQuery(document).on('click', 'video', function(e) {
        //console.log('video clicked');
        var vid = jQuery(this).get(0);
        if(vid.paused ||vid.ended) {
            vid.play();
        } else {
            vid.pause();
        }
    });

    SQSP.instances.clipGrids = [];
    jQuery('.video-gallery-videos').each(function() {
        var $thisGrid = jQuery(this);
        SQSP.instances.clipGrids.push(new ClipGrid($thisGrid, {
            sizes : ['small'],
            payload: $thisGrid.data('payload'),
            loadMoreCTA: $thisGrid.parents('section').find('.load-more-cta')
        }));
    });
};