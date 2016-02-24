SQSP.functions.initPage = function() {

    console.log('INIT EPISODES PAGE');

    SQSP.functions.createEpisodeHero();

    jQuery('.poster').each(function() {
        var $thisPoster = jQuery(this);
        var $thismodel =  $thisPoster.find('.model-container');
        new SVGClipper($thismodel, {
        });
    });

    //SQSP.$objects.postersContainer = jQuery('.posters');
    //SQSP.$objects.postersItems = jQuery('.prllxposter');
    //SQSP.instances.ParallaxPosters = [];
    //
    //// CREATE INTERACTIVE POSTERS
    //SQSP.$objects.postersItems.each(function(i) {
    //
    //    var $thisPoster = jQuery(this);
    //
    //    SQSP.instances.ParallaxPosters.push( new ParallaxPoster($thisPoster, {
    //        amount:5,
    //        offsets: {
    //            container: 13,
    //            layers: [
    //                0,  // hover-layer
    //                10, // bg-layer
    //                14, // model-layer
    //                18  // copy-layer
    //            ]
    //        }
    //    }) );
    //
    //});

};