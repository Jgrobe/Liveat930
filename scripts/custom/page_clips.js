SQSP.functions.initPage = function() {

    console.log('init clips overview page');

    SQSP.instances.videoGrid = new ClipGrid(jQuery('.video-gallery-videos'), {
        itemSelector : '.video',
        sizes : ['small', 'large'],
        onInit:function() {
            console.log('Grid initialized');
        }
    });
};