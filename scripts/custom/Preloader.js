/*
* Dependencies:
* lodash.js
* jQuery
* */
var Preloader = function( options ) {
    var PL = this;
    PL.options = {
        assetSelector : 'img, .img, .imgfill',
        onStart : false,
        onProgress: false,
        onComplete: false
    };
    if(typeof options !== 'undefined') jQuery.extend(PL.options, options);

    PL.preload = function(sources, functions) {
        if(typeof functions === 'undefined') functions = {};
        if(_.isFunction(functions.onStart)) functions.onStart(PL);
        
        var loaded = 0;
        for(var i=0; i<sources.length; i++) {
            ////console.log('preload '+sources[i]);
            var img = new Image();
            img.onload = img.onerror = function() {
                ////console.log(img.src + ' loaded');
                loaded++;
                PL.progress = {
                    pct: (loaded / sources.length)
                };

                if( _.isFunction(functions.onProgress) ) functions.onProgress(PL);

                if(loaded >= sources.length) {
                    ////console.log('all imgs loaded');
                    if(_.isFunction(functions.onComplete)) functions.onComplete(PL);
                }// endif
            };
            img.src = sources[i];
        }// endfor
    };// preload()

    init();
    
    function init() {
        PL.assets = get_preload_sources();
        PL.preload(PL.assets,{
            onStart: PL.options.onStart,
            onProgress : PL.options.onProgress,
            onComplete: PL.options.onComplete
        });
    }// init()

    function get_preload_sources() {
        var srcs = [];
        jQuery(PL.options.assetSelector).each(function() {
            var $this = jQuery(this);
            if($this.hasAttr('src')) srcs.push($this.attr('src'));
            if($this.hasAttr('style')) {
                var style = $this.get(0).currentStyle || window.getComputedStyle($this.get(0), false);
                var src = style.backgroundImage.slice(4, -1).replace(/"/g, "");
                srcs.push(src);
            }
        });
        ////console.log('found img srcs: ', srcs);
        return srcs;
    }// get_preload_sources()

};// Preloader