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
        onLayout : false
    }, options);
    CG.$object = {
        container: $container,
        items : $container.find(CG.options.itemSelector)
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
            layoutMode : 'masonry',
            masonry : {
                gutter: CG.options.gutterSizerSelector
            }
        });

        CG.filter( CG.options.filter? CG.options.filter : CG.options.itemSelector );

        if(_.isFunction(CG.options.onIinit)) CG.options.onIinit();

    };// initGrid

    CG.filter = function(filter) {

        CG.currentFilter = filter;

        CG.setSizes( CG.$object.container.find(filter) );

        CG.$object.container.isotope({
            filter: CG.currentFilter
        });

    };// filter

    CG.layout = function() {

        CG.$object.container.isotope();

    };// rearrange

    CG.init = function() {

        CG.initGrid();

    };// init()

    if(CG.options.autoInit) CG.init();

};// ClipGrid()