var ParallaxPosters = function($container, options) {
    if(typeof $container === 'undefined') return;
    var PP = this;
    var defaults = {
        
    };
    if(typeof options !== 'undefined') jQuery.extend(defaults, options);
    PP.options = defaults;
    PP.$object = {
      container : $container,
        light: $container.find('.light'),
        layers: $container.find('.layer')
    };
    
    init();
    
    function init() {
        
    }// init()
};// ParallaxPosters()

//var $card = $('.card'),
//    $light = $('.light'),
//    $layer = $('div[class*="layer-"]');
$(window).on('mousemove', function(e) {
    var w = $(window).width(), //window width
        h = $(window).height(), //window height
        offsetX = 0.5 - e.pageX / w, //cursor position X
        offsetY = 0.5 - e.pageY / h, //cursor position Y
        dy = e.pageY - h / 2, //@h/2 = center of poster
        dx = e.pageX - w / 2, //@w/2 = center of poster
        theta = Math.atan2(dy, dx), //angle between cursor and center of poster in RAD
        angle = theta * 180 / Math.PI - 90, //convert rad in degrees
        offsetPoster = $card.data('offset'),
        transformPoster = 'translateY(' + -offsetX * offsetPoster + 'px) rotateX(' + (-offsetY * offsetPoster) + 'deg) rotateY(' + (offsetX * (offsetPoster * 2)) + 'deg)'; //poster transform

    //get angle between 0-360
    if (angle < 0) {
        angle = angle + 360;
    }
    //gradient angle and opacity
    $light.css('background', 'linear-gradient(' + angle + 'deg, rgba(255,255,255,' + e.pageY / h * .5 + ') 0%,rgba(255,255,255,0) 80%)');
    //poster transform
    $card.css('transform', transformPoster);

    //parallax foreach layer
    $layer.each(function() {
        var $this = $(this),
            offsetLayer = $this.data('offset') || 0,
            transformLayer = 'translateX(' + offsetX * offsetLayer + 'px) translateY(' + offsetY * offsetLayer + 'px)';
        $this.css('transform', transformLayer);
    });

});