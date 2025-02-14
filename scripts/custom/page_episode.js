SQSP.functions.initPage = function() {

    //console.log('init page');

    SQSP.functions.windowLoad.push(function() {
        //console.log('Page Episode loaded');
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

    var $episodePlayer = jQuery('#episode-player');
    var $overlayCloser = $episodePlayer.find('.close-overlay');
    SQSP.vars.isPlayerTransitionActive = false;

    jQuery('#cta-play-episode').click(function(e) {

        e.preventDefault();

        openPlayer($episodePlayer);

        //var $clicked = jQuery(this);
        //var vidURL = $clicked.data('url');
        //
        //var episode =;
        //
        //var $overlay = jQuery('');
        //TweenMax.set($overlay, {
        //
        //});
        //var $overlayvideo = jQuery('<video src="'+ vidURL +'" autoplay/>');
        //$overlayvideo.get(0).addEventListener('loadeddata', function() {
        //    $overlay.append();
        //    size_video();
        //});
        //jQuery('body').append($overlay);
        //TweenMax.to($overlay,.4, {autoAlpha:1});
        //
        //$overlay.click(function() {
        //    TweenMax.to($overlay,.3, {autoAlpha:0, onComplete:function(){$overlay.remove();}})
        //});

    });// click()

    $overlayCloser.click(function(e) {
        e.preventDefault();
        closePlayer($episodePlayer);
    });// click()

};// initPage

function openPlayer($overlay) {
    if(SQSP.vars.isPlayerTransitionActive) return false;
    SQSP.vars.isPlayerTransitionActive = true;

    lock(jQuery('body'), '100vh');

    var tl = new TimelineMax({onComplete:function(){
        SQSP.vars.isPlayerTransitionActive=false;
        // play episode automatically
        $overlay.find('video').get(0).play();
    }});
    tl.set($overlay, {display:'block'});
    tl.add(function() {
        size_video();
    });
    tl.to($overlay,.8, {autoAlpha:1});
}// openPlayer()

function closePlayer($overlay) {
    if(SQSP.vars.isPlayerTransitionActive) return false;
    SQSP.vars.isPlayerTransitionActive = true;

    unlock(jQuery('body'));
    $overlay.find('video').get(0).pause();

    var tl = new TimelineMax({onComplete:function(){
        SQSP.vars.isPlayerTransitionActive=false;
    }});
    tl.to($overlay,.8, {autoAlpha:0, clearProps:'all'});
}// closePlayer()