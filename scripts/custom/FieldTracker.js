var FieldTracker = function($tracker, options) {
    var TF = this;
    var defaults = {
        fieldSelector : '.tracking-field',
        mirror: true
    };
    if(typeof options.functions === 'undefined') options.functions = {};
    if(typeof options !== 'undefined') jQuery.extend(defaults, options);
    TF.options = defaults;

    TF.$object = {
        tracker : $tracker,//$tracker,
        field : jQuery(TF.options.fieldSelector)//jQuery(TF.options.fieldSelector)
    };

    TF.$object.field.on('mousemove', function(e) {
        if(get_breakpoint() !== 'desktop') return false;

        if(_.isFunction(TF.options.functions.onTrack)) {
            TF.options.functions.onTrack(e, TF);
        }// endif

        TF.$object.tracker.css({
            top: e.clientY,
            left: e.clientX
        });

    });// onmousemove

    TF.$object.field.on('mouseenter', function(e) {
        if(get_breakpoint() !== 'desktop') return false;
        jQuery(this).on('mousemove.disabled', false);
        onStart(e, TF);
    }).on('mouseleave', function(e) {
        jQuery(this).off('mousemove.disabled');
        onStop(e, TF);
    });
    
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