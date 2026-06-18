SQSP.functions.initPage = function() {

    //console.log('init clips overview page');

};// initPage()


// --- Clips overview: video grid + category filters ---------------------------
// Self-triggered on the window 'load' event, and deliberately NOT run from
// SQSP.functions.initPage: ui.js calls initPage() *before* this file defines it
// (script-order bug), so initPage never runs on these pages -- which left the
// clips grid uninitialised (collapsed to height:0) and the category filters
// dead. Registering our own window-load handler (the same self-registering
// pattern used on episode pages) guarantees it runs; deferring to 'load' also
// lets isotope/masonry lay out after the clip images have real dimensions.
// Guarded to run once; wrapped in try/catch so it can never break the page.
var clipsPageDone = false;
function initClipsPage() {
    if (clipsPageDone) return;
    clipsPageDone = true;
    try {

        var uriFilter = getUriParams('filter');

        var $clipGrid = jQuery('.video-gallery-videos');
        if (!$clipGrid.length) return; // not the clips overview page

        SQSP.instances.videoGrid = new ClipGrid($clipGrid, {
            itemSelector : '.video',
            filter : uriFilter ? ('.'+uriFilter) : false,
            sizes : ['small', 'large'],
            distributeSizes : [0,0,1,0,0,1,0,0,0,0],
            payload: $clipGrid.data('payload'),
            loadMoreCTA: $clipGrid.parents('section').find('.load-more-cta'),
            onInit:function() {
                //console.log('Grid initialized');
            }
        });

        var $filterBtns = jQuery('.video-filter-item');
        $filterBtns.click(function(e) {
            e.preventDefault();
            var $clicked = jQuery(this);
            if(SQSP.instances.videoGrid.isFilterInProgress || $clicked.hasClass('current-item')) return false;// avoid toggleClass if still filtering
            $clicked.siblings().removeClass('current-item');
            $clicked.toggleClass('current-item');
            SQSP.instances.videoGrid.filter( ('.'+$clicked.data('filter')) );
        });

        // set current item class on filter menu if filtered by URIParams
        if(uriFilter) {
            $filterBtns.each(function() {
                var $thisBtn = jQuery(this);
                if($thisBtn.data('filter') === uriFilter) {
                    $thisBtn.siblings().removeClass('current-item');
                    $thisBtn.addClass('current-item');
                    return false;
                }// endif
            });// endeach
        }// endif

    } catch (err) {
        if (window.console) console.error('Clips page init failed:', err);
    }
}// initClipsPage

jQuery(window).on('load', initClipsPage);
// Fallback: if the load event already fired by the time this runs, init next tick.
if (document.readyState === 'complete') setTimeout(initClipsPage, 0);
