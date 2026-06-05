SQSP.functions.initPage = function() {

    //console.log('init page');

    SQSP.functions.windowLoad.push(function() {
        //console.log('Page Episode loaded');
    });

    // Related clip grids. Wrapped in try/catch so that a missing dependency,
    // an empty grid, or any error in here can NEVER abort page init. This used
    // to run before the play button was bound, so a grid error left the
    // "Play full episode" button dead (it only appended "#" to the URL).
    try {

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

    } catch (err) {
        if (window.console) console.error('Related clip grids failed to init:', err);
    }

};// initPage


// --- Episode player controls -------------------------------------------------
// Bound on document-ready, via event delegation on document, and completely
// independent of SQSP.functions.initPage. Previously this binding lived at the
// END of initPage, AFTER the related-clips grids were created -- so whenever a
// grid threw during init, initPage aborted before the binding line was reached
// and clicking "Play full episode" did nothing but add "#" to the URL.
//
// Delegation (.on(document, ...)) also means the handler works no matter when
// the #cta-play-episode button is generated from its .cta-dummy by
// cta-converter.js, removing any script-ordering dependency.
jQuery(function() {

    if (typeof SQSP !== 'undefined') {
        SQSP.vars = SQSP.vars || {};
        SQSP.vars.isPlayerTransitionActive = false;
    }

    jQuery(document)
        .off('click.epPlay', '#cta-play-episode')
        .on('click.epPlay', '#cta-play-episode', function(e) {
            e.preventDefault();
            openPlayer(jQuery('#episode-player'));
        })
        .off('click.epClose', '#episode-player .close-overlay')
        .on('click.epClose', '#episode-player .close-overlay', function(e) {
            e.preventDefault();
            closePlayer(jQuery('#episode-player'));
        });

});// episode player binding

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