SQSP.functions.initPage = function() {

    console.log('init page');

    SQSP.functions.windowLoad.push(function() {
        console.log('Page Episode loaded');
    });

    SQSP.isntances.relatedClipsGrid = new ClipGrid(jQuery('.related-clips-gallery'), {
        sizes : ['small']
    });

    SQSP.isntances.relatedClipsCategoriesGrid = new ClipGrid(jQuery('.related-clips-categories-gallery'), {
        sizes : ['small', 'medium'],
        distributeSizes : [1,1,0,0,0]
    });

};