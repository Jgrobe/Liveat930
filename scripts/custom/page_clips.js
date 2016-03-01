SQSP.functions.initPage = function() {

    console.log('init clips overview page');

    SQSP.instances.videoGrid = new ClipGrid(jQuery('.video-gallery-videos'), {
        itemSelector : '.video',
        //filter : '.video',
        sizes : ['small', 'large'],
        distributeSizes : [0,0,1,0,0,1,0,0,0,0],
        onInit:function() {
            console.log('Grid initialized');
        }
    });

    var $filterBtns = jQuery('.clips-filter-trigger');
    $filterBtns.click(function(e) {
        e.preventDefault();
        $filterBtns.removeClass('current-item');
        var $clicked = jQuery(this);
        $clicked.addClass('current-item');
        SQSP.instances.videoGrid.filter( ('.'+$clicked.data('filter')) );
    })
};