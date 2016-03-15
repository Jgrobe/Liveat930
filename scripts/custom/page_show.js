SQSP.functions.initPage = function() {

    //console.log('init clips overview page');

    var $videoGrid = jQuery('.video-gallery-videos');
    SQSP.instances.videoGrid = new ClipGrid($videoGrid, {
        itemSelector : '.video',
        sizes : ['medium'],
        payload : $videoGrid.data('payload'),
        onInit:function() {
            //console.log('Grid initialized');
        }
    });// ClipGrid()

};