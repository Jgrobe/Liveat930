var FieldTracker = function($tracker, options) {
    var TF = this;
    var defaults = {
        fieldSelector : '.tracking-field',
        activeClass : 'active',
        mirror: true
    };
    if(typeof options.functions === 'undefined') options.functions = {};
    if(typeof options !== 'undefined') jQuery.extend(defaults, options);
    TF.options = defaults;

    TF.$object = {
        tracker : $tracker,//$tracker,
        field : jQuery(TF.options.fieldSelector)//jQuery(TF.options.fieldSelector)
    };

    jQuery(document).on('mousemove', TF.options.fieldSelector, function(e) {
        if(is_mobile()) return false;
        if(!TF.$object.tracker.hasClass(TF.options.activeClass)) return false;

        if(_.isFunction(TF.options.functions.onTrack)) {
            TF.options.functions.onTrack(e, TF);
        }// endif

        TF.update({x: e.clientX, y: e.clientY});

    });// onmousemove

    //jQuery(document).on('mouseenter', TF.options.fieldSelector, function(e) {
    //    if(get_breakpoint() !== 'desktop') return false;
    //    jQuery(document).on('mousemove.disabled', false);
    //    onStart(e, TF);
    //}).on('mouseleave', TF.options.fieldSelector, function(e) {
    //    jQuery(document).off('mousemove.disabled');
    //    onStop(e, TF);
    //});

    TF.update = function(mouse) {
        TF.$object.tracker.css({
            top: mouse.y,
            left: mouse.x
        });
    } ;// update()

    function onStart(e, instance) {
        if(_.isFunction(TF.options.functions.onStart)) {
            TF.options.functions.onStart(e, instance);
            return;
        }// endif OVERRIDE
        
        TF.$object.tracker.css({visibility : 'visible'});
    }// onStart()

    function onStop(e, instance) {
        if(_.isFunction(TF.options.functions.onStop)) {
            TF.options.functions.onStop(e, instance);
            return;
        }// endif OVERRIDE
        
        TF.$object.tracker.css({visibility : 'hidden'});
    }// onStop()

    //console.log('FieldTracker', TF);

};// TrackingField()