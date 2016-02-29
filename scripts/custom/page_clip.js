SQSP.functions.initPage = function() {

    console.log('init clip detail page');

    SQSP.instances.shapes = [];
    jQuery('.make-shape').each(function(i) {
        var $this = jQuery(this);

        SQSP.instances.shapes.push(new SVGClipper($this, {
            shape: $this.attr('data-shape'),
            maskID: ('clip_'+i),
            assetPath: location.origin + '/assets/images/shapes/',
            onInit:function(Clip){
                console.log('svgclipper oninit',Clip);
                //GradientMaps.applyGradientMap(Painter.DOM.baseCanvas.object, Clip.shapes[Clip.options.shape].gradientMaps.full);
                GradientMaps.applyGradientMap($this.get(0), Clip.shapes[Clip.options.shape].gradientMaps.shape);
            }
        }));
    });
};