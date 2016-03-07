SQSP.functions.initPage = function() {

    console.log('init page');

    SQSP.functions.windowLoad.push(function() {
        console.log('Page Episode loaded');
    });


    var $relatedGrid = jQuery('.related-clips-gallery');
    SQSP.instances.relatedClipsGrid = new ClipGrid($relatedGrid, {
        sizes : ['small'],
        payload : $relatedGrid.data('payload'),
        loadMoreCTA: $relatedGrid.parents('section').find('.load-more-cta')
    });

    var $catGrid = jQuery('.related-clips-categories-gallery');
    SQSP.instances.relatedClipsCategoriesGrid = new ClipGrid($catGrid, {
        sizes : ['medium'],
        payload : $catGrid.data('payload'),
        //distributeSizes : [1,1,0,0,0]
    });

};