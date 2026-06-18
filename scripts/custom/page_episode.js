SQSP.functions.initPage = function() {

    //console.log('init page');

    SQSP.functions.windowLoad.push(function() {
        //console.log('Page Episode loaded');
    });

};// initPage


// --- Related clip grids ------------------------------------------------------
// Self-triggered on the window 'load' event, and deliberately NOT run from
// SQSP.functions.initPage: on episode pages ui.js calls initPage() *before*
// this file has defined it (script-order bug), so initPage never actually runs
// here. Registering our own window-load handler -- the same self-registering
// pattern that makes the play button reliable -- guarantees the grids initialise.
// Deferring to 'load' also ensures isotope/masonry lays out after the clip
// images have real dimensions (running earlier collapses the grid to height:0).
// Guarded to run once; wrapped in try/catch so it can never break the page.
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

jQuery(window).on('load', initRelatedGrids);
// Fallback: if the load event already fired by the time this runs, init next tick.
if (document.readyState === 'complete') setTimeout(initRelatedGrids, 0);


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
