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
        filterOut : function(instance, functions) {
            if(typeof functions === 'undefined') functions = {};
            var tl = new TimelineMax({onComplete:function(){
                if(_.isFunction(functions.onComplete)) functions.onComplete();
                console.log('::::: filterOut complete', tl.duration());
            }});
            //console.log('stagger animate out items : ', CG.$object.currentItems);
            tl.staggerTo(instance.$object.currentItems, instance.options.staggerDuration, {autoAlpha:0, onComplete:function(){
                //console.log('item staggered');
            }}, instance.options.staggerOffset);
            return tl;
        },
        filterIn : function(instance) {
            var tl = new TimelineMax();
            tl.staggerTo(instance.$object.currentItems, instance.options.staggerDuration, {autoAlpha:1}, instance.options.staggerOffset);
            return tl;
        }
    }, options);
    CG.$object = {
        container: $container,
        items : $container.find(CG.options.itemSelector),
        currentItems : ( CG.options.filter ? $container.find(CG.options.filter) : $container.find(CG.options.itemSelector) )
    };
    CG.options.payload = parseInt(CG.options.payload);
    CG.currentCount = CG.options.payload;

    CG.setSizes = function($items) {

        // remove all sizes
        CG.$object.items.removeClass(CG.options.sizes.join(' '));

        var sizeCounter = 0;

        $items.each(function(i) {

            var $thisItem = jQuery(this);

            var sizeSelector = ( CG.options.distributeSizes ? CG.options.distributeSizes[sizeCounter] : sizeCounter );
            var itemSize = CG.options.sizes[ sizeSelector ];
            //console.log('sizeSelector', sizeSelector, 'itemSize', itemSize);
            $thisItem.addClass( itemSize );

            sizeCounter++;
            //console.log(sizeCounter +' >= ' + (CG.options.distributeSizes ? CG.options.distributeSizes.length : CG.options.sizes.length) + '?', ( sizeCounter >= (CG.options.distributeSizes ? CG.options.distributeSizes.length : CG.options.sizes.length) ));
            if( sizeCounter >= (CG.options.distributeSizes ? CG.options.distributeSizes.length : CG.options.sizes.length) ) sizeCounter = 0;

        });// each()

    };// setSizes()

    CG.initGrid = function() {

        CG.$object.container.isotope({
            itemSelector : CG.options.itemSelector,
            transitionDuration: 0,// use custom transitions via functions defined in options
            layoutMode : 'masonry',
            //containerStyle : null,
            masonry : {
                gutter: CG.options.gutterSizerSelector
            }
        });

        CG.$object.container.on('arrangeComplete', function(){
            console.log('------ grid arrangeComplete', CG.$object.container.height());
        });
        CG.$object.container.on('layoutComplete', function(){
            console.log('------ grid layoutComplete', CG.$object.container.height());
        });

        //console.log('init grid w/filter', CG.options.filter, (CG.options.filter ? CG.options.filter : CG.options.itemSelector) );
        CG.filter( CG.options.filter ? CG.options.filter : CG.options.itemSelector );

        if(_.isFunction(CG.options.onIinit)) CG.options.onIinit();

    };// initGrid

    CG.filter = function(filter) {
        if(CG.isFilterInProgress) return false;
        CG.isFilterInProgress = true;

        if(filter == CG.currentFilter) return false;// filter = CG.options.itemSelector; // commented code 'unfilters' items -> setting back to all items

        CG.currentFilter = filter;

        var filterTL = new TimelineMax({onComplete:function(){console.log('filterTL complete')}});

        // animate items out
        if(_.isFunction(CG.options.filterOut)) {
            //console.log('animate items out');
            //filterTL.add( CG.options.filterOut(CG) );// must fire fn() to get timeline!
        }// endif

        // do actual filtering
        filterTL.add(function() {

            CG.addItems(filter);

        });

    };// filter()

    CG.addItems = function(filter) {
        // capture current grid height
        var oldGridHeight = CG.$object.container.height();
        // filter items
        CG.$object.currentItemsAll = CG.$object.container.find( filter );
        CG.$object.currentItems = CG.$object.container.find( filter+':lt('+ CG.currentCount +')' );
//console.log('>>>>>>> items to filter', CG.currentCount, CG.$object.currentItems);
        //if( _.isFunction(CG.options.filterIn) ) TweenMax.set( CG.$object.currentItems, {autoAlpha: 0} );
        // set size classes on new items
        CG.setSizes( CG.$object.currentItems );

        // let isotope layout the new items
        CG.$object.container.isotope({
            filter: CG.currentFilter
        });

        // -------- THIS IS A DIRTY FUCKIN FIX FOR ISOTOPE NEEDING A SECOND LAYOUT() IN ORDER TO SIZE THE GRID CORRECTLY
        // reset gridHeight to oldHeihgt after first layout() to prevent flickering
        CG.$object.container.height(oldGridHeight);
        // need a delay for second layout()
        setTimeout(function() {
            console.log('reset timeout');
            CG.layout();

            // capture new grid height
            var newGridHeight = CG.$object.container.height();
            //console.log('::::addItems init', oldGridHeight, newGridHeight);

            var inTL = new TimelineMax({onComplete:function() {
                CG.updateCTA();
                CG.isFilterInProgress = false;
            }});
            // tween grid height old to new
            inTL.fromTo(CG.$object.container, CG.options.duration, {height:oldGridHeight}, {height:newGridHeight, ease:Expo.easeInOut});

            // animate items in
            if( _.isFunction(CG.options.filterIn) ) {
                // animate items in
                //console.log('animate items in');
                inTL.add( CG.options.filterIn(CG), '-='+(CG.options.duration *.5) );
            } else {
                CG.isFilterInProgress = false;
            }// endif

        }, 200);

    };// addItems

    CG.layout = function() {

        CG.$object.container.isotope();

    };// rearrange

    CG.updateCTA = function() {
        if(!CG.options.loadMoreCTA) return false;

        if(CG.currentCount >= CG.$object.currentItemsAll.length) {
            TweenMax.to(CG.options.loadMoreCTA, CG.options.duration, {autoAlpha:0});
        } else {
            TweenMax.to(CG.options.loadMoreCTA, CG.options.duration, {autoAlpha:1});
        }

    };// updateCTA()

    CG.resetPayload = function() {
        CG.currentCount = CG.options.payload;
    };// resetPayload

    CG.init = function() {

        //console.log('Init ClipGrid', CG);

        CG.initGrid();

        if(CG.options.loadMoreCTA) {
            CG.options.loadMoreCTA.click(function(e){
                e.preventDefault();

                CG.currentCount += CG.options.payload;
                CG.addItems(CG.currentFilter);

            });
        }// endif

    };// init()

    if(CG.options.autoInit) CG.init();

};// ClipGrid()