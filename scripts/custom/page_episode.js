SQSP.functions.initPage = function() {

    //console.log('init page');

    SQSP.functions.windowLoad.push(function() {
        //console.log('Page Episode loaded');
    });

    // Related clip grids. Deferred to the window 'load' event so that:
    //   1) it runs past the early init race that previously left the grids
    //      uninitialised on a normal page load, and
    //   2) isotope/masonry lays out AFTER the clip images have real dimensions
    //      (running it earlier collapses the grid to height:0 / empty).
    // Still wrapped in try/catch so a grid error can never break the page, and
    // guarded so it only runs once per page init. Empirically verified: running
    // the same init post-load renders the grid correctly (full height, all tiles).
    var relatedGridsDone = false;
    function initRelatedGrids() {
        if (relatedGridsDone) return;
        relatedGridsDone = true;
        try {

            var $relatedGrid = jQuery('.related-clips-gallery');
            if ($relatedGrid.length) {
                SQSP.instances.relatedClipsGrid = new ClipGrid($relatedGrid, {
                    sizes : ['small'],
                    payload : $relatedGrid.data('payload'),
                    loadMoreCTA: $relatedGrid.parents('section').find('.load-more-cta')
                });
            }

            var $catGrid = jQuery('.related-clips-categories-gallery');
            if ($catGrid.length) {
                SQSP.instances.relatedClipsCategoriesGrid = new ClipGrid($catGrid, {
                    sizes : ['medium'],
                    payload : $catGrid.data('payload')
                    //distributeSizes : [1,1,0,0,0]
                });
            }

        } catch (err) {
            if (window.console) console.error('Related clip grids failed to init:', err);
        }
    }// initRelatedGrids

    // If the page has already finished loading (e.g. SPA-style transition),
    // run on the next tick; otherwise wait for the window load event.
    if (document.readyState === 'complete') {
        setTimeout(initRelatedGrids, 0);
    } else {
        jQuery(window).on('load', initRelatedGrids);
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
