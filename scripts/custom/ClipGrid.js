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
        duration:.4,
        staggerDuration:.2,
        staggerOffset:.08,
        payload : 3,
        loadMoreCTA : false,
        filterOut : function() {
            var tl = new TimelineMax({onComplete:function(){console.log('filterOut complete', tl.duration());}});
            console.log('stagger animate out items : ', CG.$object.currentItems);
            tl.staggerTo(CG.$object.currentItems, CG.options.staggerDuration, {autoAlpha:0, onComplete:function(){console.log('item staggered');}}, CG.options.staggerOffset);
            return tl;
        },
        filterIn : function() {
            var tl = new TimelineMax({onComplete:function(){CG.isFilterInProgress = false;}});
            tl.staggerTo(CG.$object.currentItems, CG.options.staggerDuration, {autoAlpha:1}, CG.options.staggerOffset);
            return tl;
        }
    }, options);
    CG.$object = {
        container: $container,
        items : $container.find(CG.options.itemSelector),
        currentItems : ( CG.options.filter ? $container.find(CG.options.filter) : $container.find(CG.options.itemSelector) )
    };
    CG.currentCount = CG.options.payload;

    CG.setSizes = function($items) {

        // remove all sizes
        //CG.$object.items.removeClass(CG.options.sizes.join(' '));

        var sizeCounter = 0;

        $items.each(function(i) {

            var $thisItem = jQuery(this);
            console.log('applying item size', $thisItem,sizeCounter, CG.options.sizes[sizeCounter] );

            var itemSize = CG.options.sizes[ ( CG.options.distributeSizes ? CG.options.distributeSizes[sizeCounter] : sizeCounter ) ];
            $thisItem.removeClass(CG.options.sizes.join(' '))
            $thisItem.addClass( itemSize );

            sizeCounter++;
            if( sizeCounter >= (CG.options.distributeSizes ? CG.options.distributeSizes.length : CG.options.sizes.length) ) sizeCounter = 0;

        });// each()

    };// setSizes()

    CG.initGrid = function() {

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
        if(CG.isFilterInProgress) return false;
        CG.isFilterInProgress = true;

        if(filter == CG.currentFilter) filter = CG.options.itemSelector;

        CG.currentFilter = filter;

        var filterTL = new TimelineMax({onComplete:function(){console.log('filterTL complete')}});

        // animate items out
        if(_.isFunction(CG.options.filterOut)) {
            console.log('animate items out');
            filterTL.add( CG.options.filterOut() );// must fire fn() to return timeline!
        }// endif

        // do actual filtering
        filterTL.add(function() {

            CG.addItems(filter);
            //CG.$object.currentItems = CG.$object.container.find( filter+':lt('+ CG.currentCount +')' );
            //
            //if( _.isFunction(CG.options.filterIn) ) TweenMax.set( CG.$object.currentItems, {autoAlpha: 0} );
            //CG.setSizes( CG.$object.currentItems );
            //CG.$object.container.isotope({
            //    filter: CG.currentFilter
            //});
            //
            //var inTL = new TimelineMax();
            //// tween grid height
            //var newGridHeight = CG.$object.container.outerHeight();
            //inTL.fromTo(CG.$object.container, CG.options.duration, {height:oldGridHeight}, {height:newGridHeight, ease:Expo.easeInOut});
            //
            //if( _.isFunction(CG.options.filterIn) ) {
            //    // animate items in
            //    console.log('animate items in');
            //    inTL.add( CG.options.filterIn(), '-='+(CG.options.duration *.5) );
            //} else {
            //    CG.isFilterInProgress = false;
            //}// endif
        });

    };// filter()

    CG.addItems = function(filter) {
        var oldGridHeight = CG.$object.container.outerHeight();
        CG.$object.currentItems = CG.$object.container.find( filter+':lt('+ CG.currentCount +')' );
console.log('>>>>>>> items to filter', CG.currentCount, CG.$object.currentItems);
        //if( _.isFunction(CG.options.filterIn) ) TweenMax.set( CG.$object.currentItems, {autoAlpha: 0} );
        CG.setSizes( CG.$object.currentItems );

        CG.$object.container.isotope({
            filter: CG.currentFilter
        });

        var inTL = new TimelineMax();
        // tween grid height
        var newGridHeight = CG.$object.container.outerHeight();
        inTL.fromTo(CG.$object.container, CG.options.duration, {height:oldGridHeight}, {height:newGridHeight, ease:Expo.easeInOut});

        if( _.isFunction(CG.options.filterIn) ) {
            // animate items in
            console.log('animate items in');
            inTL.add( CG.options.filterIn(), '-='+(CG.options.duration *.5) );
        } else {
            CG.isFilterInProgress = false;
        }// endif
    };// addItems

    CG.layout = function() {

        CG.$object.container.isotope();

    };// rearrange

    CG.updateCTA = function() {

        if(CG.currentCount >= CG.$object.currentItems.length) {
            TweenMax.to(CG.options.loadMoreCTA, CG.options.duration, {autoAlpha:0});
        } else {
            TweenMax.to(CG.options.loadMoreCTA, CG.options.duration, {autoAlpha:1});
        }

    };// updateCTA()

    CG.resetPayload = function() {
        CG.currentCount = CG.options.payload;
    };// resetPayload

    CG.init = function() {

        console.log('Init ClipGrid', CG);

        CG.initGrid();

        if(CG.options.loadMoreCTA) {
            CG.options.loadMoreCTA.click(function(e){
                e.preventDefault();

                CG.currentCount += CG.options.payload;
                CG.addItems(CG.currentFilter);
                CG.updateCTA();

            });
        }// endif

    };// init()

    if(CG.options.autoInit) CG.init();

};// ClipGrid()