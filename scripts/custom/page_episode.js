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

    jQuery(document).on('click', '#cta-play-episode', function(e) {

        var $clicked = jQuery(this);
        var vidURL = $clicked.data('url');

        var $overlay = jQuery('<div class="video-overlay" preload="none"/>');
        TweenMax.set($overlay, {
            position: 'fixed',
            top:0,
            left:0,
            width: '100%',
            height: '100%',
            'z-index' : '999',
            background: 'rgba(0,0,0,.8)',
            autoAlpha: 0
        });
        var $overlayvideo = jQuery('<video src="'+ vidURL +'" autoplay/>');
        $overlayvideo.get(0).addEventListener('loadeddata', function() {
            $overlay.append();
            size_video();
        });
        jQuery('body').append($overlay);
        TweenMax.to($overlay,.4, {autoAlpha:1});

        $overlay.click(function() {
            TweenMax.to($overlay,.3, {autoAlpha:0, onComplete:function(){$overlay.remove();}})
        });
    });// click()

};