SQSP.functions.initPage = function() {

    console.log('INIT EPISODES PAGE');

    jQuery('.poster').each(function() {
        var $thisPoster = jQuery(this);
        var $thismodel =  $thisPoster.find('.model-container');
        new SVGClipper($thismodel, {
            shape: $thismodel.data('shape'),
            onInit:function(Clip){
                //GradientMaps.applyGradientMap(Clip.DOM.container.object, Clip.shapes[Clip.options.shape].gradientMaps.shape);
            }
        });
    });

    SQSP.$objects.postersContainer = jQuery('.posters');
    SQSP.$objects.postersItems = jQuery('.prllxposter');
    SQSP.instances.ParallaxPosters = [];

    // CREATE INTERACTIVE POSTERS
    SQSP.$objects.postersItems.each(function(i) {

        var $thisPoster = jQuery(this);

        SQSP.instances.ParallaxPosters.push( new ParallaxPoster($thisPoster, {
            amount:5,
            offsets: {
                container: 13,
                layers: [
                    0,  // hover-layer
                    10, // bg-layer
                    14, // model-layer
                    18  // copy-layer
                ]
            }
        }) );

    });

};