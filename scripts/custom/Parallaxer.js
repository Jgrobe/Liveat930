/*
* Dependencies:
* jQuery
* scrollMonitor
* */
var Parallaxer = function ($elems, options) {
    if(typeof $elems === 'undefined' || $elems.length <= 0) return;
    var P = this;
    P.options = {
        enabledClass : 'parallax-enabled',
        amount :.1,
        customAmount: false
    };
    if(typeof options !== 'undefined') jQuery.extend(P.options, options);
    P.$object = {
        elems : $elems
    };

    P.watchers = [];
    P.$object.elems.each(function(i, elem) {
        var $this = jQuery(this);

        if($this.hasClass('prllx-no-disable')) {
            $this.addClass(P.options.enabledClass);
            return true;
        }

        var $watcher = scrollMonitor.create( elem, 20 );
        //console.log('watcher item', $watcher);

        $watcher.enterViewport(function() {
            //console.log( 'I have entered the viewport' );
            //console.log('adding enabledClass to elem no. '+i);
            $this.addClass(P.options.enabledClass);
        });
        $watcher.exitViewport(function() {
            //console.log( 'I have left the viewport' );
            //console.log('removing enabledClass from elem no. '+i);
            $this.removeClass(P.options.enabledClass);
        });

        P.watchers.push($watcher);
    });

    jQuery(window).load(function() {
        setTimeout(function() {
            //console.log('delayed');
            parallaxing();
        },200);
    }).resize(function() {
        parallaxing();
    }).scroll(function() {
        parallaxing();
    });

    function parallaxing() {
        //console.log('do parallaxing');
        if(is_mobile()) {
            TweenMax.set(P.$object.elems, {clearProps:'y'});
            return false;
        }// endif;

        var windowScrollTop = jQuery(window).scrollTop();

        P.$object.elems.each(function(i) {
            var $this = jQuery(this);
            if(!$this.hasClass(P.options.enabledClass)) return true;

            var elemScrollTop = $this.offset().top;

            var amount = P.options.customAmount ? P.options.customAmount({
                $elem: $this
            }) : P.options.amount;

            var y = ( elemScrollTop - windowScrollTop - (window.innerHeight *.5) ) * amount;

            if($this.hasClass('prllx-scroll-depend')) {
                var setzero = y - (-windowScrollTop*amount);
                y -= setzero;
            }// dirty fix for landing parallaxers starting at 0 - relative to window scrolltop
            //console.log($this.offset().top, jQuery(window).scrollTop(), jQuery(window).height(), y);
            //console.log('prllx y',y);
            TweenMax.to($this,.2, {y:y});
        });
    }// parallaxing()

}// init_parallax()