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
        //console.log('------filterBtn clicked', $clicked.data('filter'));
        $clicked.siblings().removeClass('current-item');
        $clicked.toggleClass('current-item');
        SQSP.instances.videoGrid.filter( ('.'+$clicked.data('filter')) );

    });

    // set current item class on filter menu if filtered by URIParams
    if(uriFilter) {
        $filterBtns.each(function() {
            var $thisBtn = jQuery(this);
            if($thisBtn.data('filter') === uriFilter) {
                $thisBtn.addClass('current-item');
                return false;
            }// endif
        });// endeach
    }// endif

};// initPage()