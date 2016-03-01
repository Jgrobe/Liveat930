SQSP.functions.initPage = function() {

    console.log('init clips overview page');

    SQSP.instances.videoGrid = new ClipGrid(jQuery('.video-gallery-videos'), {
        itemSelector : '.video',
        sizes : ['medium'],
        onInit:function() {
            console.log('Grid initialized');
        }
    });// ClipGrid()

};