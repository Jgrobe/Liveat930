var ParallaxPoster = function($container, options) {
    if(typeof $container === 'undefined') return;
    var PP = this;
    var defaults = {
        amount:.5,
        duration:.2,
        offsets: false
    };
    if(typeof options !== 'undefined') jQuery.extend(defaults, options);
    PP.options = defaults;
    PP.$object = {
      container : $container,
        poster: $container.find('.poster'),
        light: $container.find('.light'),
        layers: $container.find('.layer')
    };
    PP.mouse = {};
    PP.transformObject = PP.$object.container;

    init();
    
    function init() {

        if(PP.options.offsets) {
            for(var i=0; i<PP.options.offsets.length; i++) {
                PP.$object.find(PP.options.offsets[i].selector).attr({
                    'data-offset' : PP.options.offsets[i].value
                });
            }// endfor
        }// if dynamicOffsets

        //console.log('instanciating ParallaxPoster', PP);

        get_window();

        jQuery(window).resize(function() {
            get_window();
        }).scroll(function() {
            get_center();
        });// window

        // MOUSE FUNCTIONS

        PP.$object.container.on('mouseenter', function(e){
            //console.log('enabling skew');
            PP.is_hovered = true;
            //console.log('START SKEW');
        }).on('mouseleave', function(e){
            //console.log('disabling skew');
            //console.log('STOP SKEW');
            PP.is_hovered = false;
            reset_poster();
        });

        jQuery(window).on('mousemove', function(e) {
            if(!PP.is_hovered) return false;
            //console.log('center value x', PP.mouse.x, (PP.$object.containerSize.center.x), (PP.mouse.x - (PP.$object.containerSize.center.x)));
            //console.log('center value y', PP.mouse.y, (PP.$object.containerSize.center.y), (PP.mouse.y - (PP.$object.containerSize.center.y)));
            PP.mouse = {
                x: e.clientX,
                y: e.clientY
            };
            skew_poster();
        });

    }// init()

    function skew_poster() {
        var w = PP.window.width, //window width
            h = PP.window.height, //window height
            offsetX = PP.$object.containerSize.relativeCenter.x - (PP.mouse.x), //cursor position X
            offsetY = PP.$object.containerSize.relativeCenter.y - PP.mouse.y; //cursor position Y
        offsetX /= PP.$object.containerSize.width;
        offsetY /= PP.$object.containerSize.height;
            var dx = PP.mouse.x - (PP.$object.containerSize.relativeCenter.x), //@w/2 = center of poster
            dy = PP.mouse.y - (PP.$object.containerSize.relativeCenter.y), //@h/2 = center of poster
            theta = Math.atan2(dy, dx), //angle between cursor and center of poster in RAD
            angle = theta * 180 / Math.PI - 90, //convert rad in degrees
            offsetPoster = PP.options.offsets ? PP.options.offsets.container : PP.options.amount;//PP.$object.container.data('offset'),
            //transformPoster = 'translateY(' + -offsetX * offsetPoster + 'px) rotateX(' + (-offsetY * offsetPoster) + 'deg) rotateY(' + (offsetX * (offsetPoster * 2)) + 'deg)'; //poster transform
        //console.log('hover offsets', offsetX, offsetY, dx, dy);

        //get angle between 0-360
        if (angle < 0) {
            angle = angle + 360;
        }// endif

        //gradient angle and opacity
        PP.$object.light.css('background', 'linear-gradient(' + angle + 'deg, rgba(255,255,255,' + (PP.mouse.y / h * .5) + ') 0%,rgba(255,255,255,0) 80%)');
        //poster transform
        //PP.$object.poster.css({
        //    '-webkit-transform': transformPoster,
        //    '-moz-transform': transformPoster,
        //    '-o-transform': transformPoster,
        //    '-ie-transform': transformPoster,
        //    'transform': transformPoster
        //});
        TweenMax.to(PP.transformObject, PP.options.duration, {y:(-offsetX * offsetPoster), rotationX:(-offsetY * offsetPoster), rotationY:(offsetX * (offsetPoster * 2))});
        //console.log('offsetX', offsetX);
        //console.log('offsetY', offsetY);
        //console.log('offsetPoster', offsetPoster);

        //parallax foreach layer
        PP.$object.layers.each(function(i) {
            var $this = jQuery(this),
                offsetLayer = PP.options.offsets ? (typeof PP.options.offsets.layers[i] !== 'undefined' ? PP.options.offsets.layers[i] : PP.options.amount) : ( PP.options.amount * (i+1) / PP.options.amount );
                //transformLayer = 'translateX(' + offsetX * offsetLayer + 'px) translateY(' + offsetY * offsetLayer + 'px)';
            //$this.css({
            //    '-webkit-transform': transformLayer,
            //    '-moz-transform': transformLayer,
            //    '-o-transform': transformLayer,
            //    '-ie-transform': transformLayer,
            //    'transform': transformLayer
            //});

            TweenMax.to($this, PP.options.duration, {x:(offsetX * offsetLayer), y:(offsetY * offsetLayer)});
        });
    }// skew_poster()

    function reset_poster() {
        TweenMax.killTweensOf(PP.transformObject);
        TweenMax.killTweensOf(PP.$object.layers);
        TweenMax.staggerTo([PP.transformObject, PP.$object.layers], PP.options.duration*2, {x:0, y:0, rotationX:0, rotationY:0, clearProps:'all', ease:Strong.easeOut});
        //PP.$object.layers.each(function(i) {
        //    var $this = jQuery(this);
        //    TweenMax.to($this, PP.options.duration*2, {x:0, y:0, clearProps:'all', ease:Strong.easeOut});
        //});
    }

    function get_window() {
        PP.window = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        PP.$object.containerSize = {
            width: PP.$object.container.width(),
            height: PP.$object.container.height(),
            top: PP.$object.container.offset().top,
            left: PP.$object.container.offset().left
        };
        get_center();
    }

    function get_center() {

        PP.$object.containerSize.center = {
            x : PP.$object.containerSize.left +( PP.$object.containerSize.width *.5),
            y : PP.$object.containerSize.top +( PP.$object.containerSize.height *.5)
        };
        PP.$object.containerSize.relativeCenter = {
            x : PP.$object.containerSize.center.x,
            y : PP.$object.containerSize.center.y - jQuery(window).scrollTop()
        };
    }

};// ParallaxPoster()