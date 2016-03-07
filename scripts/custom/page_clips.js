SQSP.functions.initPage = function() {

    console.log('init clips overview page');
    var uriFilter = getUriParams('filter')

    var $clipGrid = jQuery('.video-gallery-videos');
    SQSP.instances.videoGrid = new ClipGrid($clipGrid, {
        itemSelector : '.video',
        filter : uriFilter ? ('.'+uriFilter) : false,
        //filter : '.video',
        sizes : ['small', 'large'],
        distributeSizes : [0,0,1,0,0,1,0,0,0,0],
        payload: $clipGrid.data('payload'),
        loadMoreCTA: $clipGrid.parents('section').find('.load-more-cta'),
        onInit:function() {
            console.log('Grid initialized');
        }
    });

    var $filterBtns = jQuery('.video-filter-item');
    $filterBtns.click(function(e) {
        if(SQSP.instances.videoGrid.isFilterInProgress) return false;// this is done in the instance automatically but needed to avoid toggleClass if still filtering
        e.preventDefault();
        //SQSP.instances.videoGrid.resetPayload();
        var $clicked = jQuery(this);
        console.log('------filterBtn clicked', $clicked.data('filter'));
        $clicked.siblings().removeClass('current-item');
        $clicked.toggleClass('current-item');
        SQSP.instances.videoGrid.filter( ('.'+$clicked.data('filter')) );

    });

    //var clipsFilter = getUriParams('filter');
    //if(clipsFilter) {
    //    console.log('------has clips filter', clipsFilter);
    //    var filterTimer = setInterval(function() {
    //        console.log('checking filterinprogress', SQSP.instances.videoGrid.isFilterInProgress);
    //        if(!SQSP.instances.videoGrid.isFilterInProgress) {
    //            console.log('filterprogress clear, filter', clipsFilter);
    //            $filterBtns.each(function() {
    //                var $thisBtn = jQuery(this);
    //                console.log('this filter is', $thisBtn.data('filter') );
    //                if($thisBtn.data('filter') === clipsFilter) {
    //                    console.log('match found', $thisBtn.data('filter') );
    //                    $thisBtn.click();
    //                    return false;
    //                }
    //            });
    //            clearInterval(filterTimer);
    //        }// endif;
    //    }, 100);
    //}// endif
};// initPage()