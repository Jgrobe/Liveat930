SQSP.functions.initPage = function() {

    console.log('init clips overview page');

    SQSP.instances.videoGrid = new ClipGrid(jQuery('.video-gallery-videos'), {
        itemSelector : '.video',
        filter : '.video',
        sizes : ['small', 'large'],
        distributeSizes : [0,0,1,0,0,1,0,0,0,0],
        onInit:function() {
            console.log('Grid initialized');
        }
    });

    jQuery('.clips-filter-trigger').click(function(e) {
        e.preventDefault();
        var $clicked = jQuery(this);
        SQSP.instances.videoGrid.filter($clicked.data('filter'));
    })
};