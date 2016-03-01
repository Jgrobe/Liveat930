/*
* Dependencies:
* jQuery
* isotope
* lodash
* */
var ClipGrid = function($container, options) {
    if(typeof $container === 'undefined') return;
    if(typeof options === 'undefined') options = {};
    var CG = this;
    CG.options = jQuery.extend({
        autoInit : true,
        itemSelector : '.video',
        gutterSizerSelector : '.gutter-sizer',
        sizes : ['medium'],
        distributeSizes: false,
        filter : false,
        onInit : false,
        onLayout : false,
        staggerDuration:.3,
        staggerOffset:.1,
        filterOut : function() {
            var tl = new TimelineMax();
            tl.staggerTo(CG.$object.currentItems, CG.options.staggerDuration, {autoAlpha:0}, CG.options.staggerOffset);
            return tl;
        },
        filterIn : function() {
            var tl = new TimelineMax();
            tl.staggerTo(CG.$object.currentItems, CG.options.staggerDuration, {autoAlpha:1}, CG.options.staggerOffset);
            return tl;
        }
    }, options);
    CG.$object = {
        container: $container,
        items : $container.find(CG.options.itemSelector),
        currentItems : ( CG.options.filter ? $container.find(CG.options.filter) : $container.find(CG.options.itemSelector) )
    };

    CG.setSizes = function($items) {

        // remove all sizes
        CG.$object.items.removeClass(CG.options.sizes.join(' '));

        var sizeCounter = 0;

        $items.each(function(i) {

            var $thisItem = jQuery(this);
            console.log('applying item size', $thisItem,CG.options.sizes[sizeCounter] );

            var itemSize = CG.options.sizes[ ( CG.options.distributeSizes ? CG.options.distributeSizes[sizeCounter] : sizeCounter ) ];
            $thisItem.addClass( itemSize );

            sizeCounter++;
            if( sizeCounter >= (CG.options.distributeSizes ? CG.options.distributeSizes.length : CG.options.sizes.length) ) sizeCounter = 0;

        });// each()

    };// setSizes()

    CG.initGrid = function() {

        console.log('Init ClipGrid', CG);

        CG.$object.container.isotope({
            itemSelector : CG.options.itemSelector,
            transitionDuration: 0,// use custom transitions via functions defined in options
            layoutMode : 'masonry',
            masonry : {
                gutter: CG.options.gutterSizerSelector
            }
        });

        CG.filter( CG.options.filter ? CG.options.filter : CG.options.itemSelector );

        if(_.isFunction(CG.options.onIinit)) CG.options.onIinit();

    };// initGrid

    CG.filter = function(filter) {
        if(filter == CG.currentFilter) return false;

        CG.currentFilter = filter;

        var filterTL = new TimelineMax();

        if(_.isFunction(CG.options.filterOut)) {
            // animate items out
            filterTL.add( CG.options.filterOut );
        }// endif

        filterTL.add(function() {
            CG.$object.currentItems = CG.$object.container.find(filter);

            CG.setSizes( CG.$object.currentItems );

            CG.$object.container.isotope({
                filter: CG.currentFilter
            });
        });

        if(_.isFunction(CG.options.filterIn)) {
            // animate items in
            filterTL.add( CG.options.filterIn );
        }// endif

    };// filter()

    CG.layout = function() {

        CG.$object.container.isotope();

    };// rearrange

    CG.init = function() {

        CG.initGrid();

    };// init()

    if(CG.options.autoInit) CG.init();

};// ClipGrid()