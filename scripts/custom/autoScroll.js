jQuery(document).on('click', '.autoscroll', function(e) {
    e.preventDefault();
    var $clicked = jQuery(this);
    if($clicked.hasClass('mobilescroll') && !is_mobile()) return false;
    var $target = $clicked.hasClass('scrolldown-container') ? BUNDY.$objects.siteHero.next('.content-block') : jQuery( $clicked.attr('href') );

    var windowH = jQuery(window).height(),
        targetY = $target.offset().top - windowH * ($clicked.hasAttr('data-pct') ? parseFloat($clicked.attr('data-pct')) : .05),
        maxY = jQuery(document).height() - windowH;

    if(targetY >  maxY) targetY = maxY;

    TweenMax.to(window, 1, {scrollTo:{y:targetY}, ease:Expo.easeOut});
});