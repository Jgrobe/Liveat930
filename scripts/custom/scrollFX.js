
function init_parallax($parallaxElems) {

    if($parallaxElems.length <= 0) return false;

    $parallaxElems.each(function(i, elem) {
        var $this = jQuery(this);
        var $watcher = scrollMonitor.create( elem, 20 );
        //console.log('watcher item', $watcher);

        $watcher.enterViewport(function() {
            //console.log( 'I have entered the viewport' );
            $this.addClass('parallax-enabled');
        });
        $watcher.exitViewport(function() {
            //console.log( 'I have left the viewport' );
            $this.removeClass('parallax-enabled');
        });
    });

    jQuery(window).load(function() {
        parallaxing($parallaxElems);
    }).scroll(function() {
        parallaxing($parallaxElems);
    });

}// init_parallax()

function parallaxing($parallaxElems) {
    if(is_mobile()) {
        TweenMax.set($parallaxElems, {y:0});
        return false;
    }
    $parallaxElems.each(function(i) {
        var $this = jQuery(this);
        if(!$this.hasClass('parallax-enabled')) return true;
        var y = ( $this.offset().top - jQuery(window).scrollTop() - jQuery(window).height() *.5 ) *.1;
        //console.log($this.offset().top, jQuery(window).scrollTop(), jQuery(window).height(), y);
        TweenMax.set($this, {y:y});
    });
}// parallaxing()