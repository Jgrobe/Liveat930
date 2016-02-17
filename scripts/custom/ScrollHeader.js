var ScrollHeader = function($object, options) {
    if(typeof $object === 'undefined') return;

    var H = this;
    var default_options = {
        enabledClass: 'enabled',
        disabledClass: 'disabled',
        duration:.3,
        absTop: 0,
        minY:{target:false},
        maxY:{target:false},
        disable: false,
        hide: true,
        onHide: false,
        onShow: false,
        customOperation: false
    };
    if(typeof options !== 'undefined') jQuery.extend(default_options, options);
    H.options = default_options;
    //console.log('ScrollHeader', H.options);
    H.$object = {
        container: $object
    };
    H.callbackParams = {
        target: H,
        posY: {
            current:window.pageYOffset,
            cached:window.pageYOffset
        }
    };

    ////console.log('ScrollHeader instantiated', H);

    H.minYenabled = (false !== H.options.minY.target);
    ////console.log('H.minYenabled', H.minYenabled, H.options.minY);
    H.maxYenabled = (false !== H.options.maxY.target);
    ////console.log('H.maxYenabled', H.maxYenabled, H.options.maxY);

    window.scrollHeaderActivated = true;
    //get_minmax_values();

    ////console.log('SCROLL HEADER ACTIVATED');

    //------------------------------ PUBLIC FUNCTIONS

    H.hideHeader = function() {
        ////console.log('hideHeader()', H.options.hide);
        if(!H.options.hide || H.$object.container.hasClass(H.options.disabledClass) || H.is_mobile) return false;

        H.$object.container.removeClass(H.options.enabledClass).addClass(H.options.disabledClass);
        //console.log(
        //    'H.$object.container.offset().top', H.$object.container.offset().top, '\n',
        //    'jQuery(window).scrollTop()', jQuery(window).scrollTop(), '\n',
        //    '(H.$object.container.offset().top - jQuery(window).scrollTop())', (H.$object.container.offset().top - jQuery(window).scrollTop()), '\n',
        //    'H.$object.container.height()', H.$object.container.outerHeight(), '\n'
        //);
        TweenMax.set(H.$object.container, {top:-( (H.$object.container.offset().top - jQuery(window).scrollTop())  + H.$object.container.outerHeight() + 1)});

        if(_.isFunction(H.options.onHide)) H.options.onHide(H.callbackParams);
    };

    H.showHeader = function() {
        ////console.log('showHeader');
        if(H.$object.container.hasClass(H.options.enabledClass)) return false;

        H.$object.container.removeClass(H.options.disabledClass).addClass(H.options.enabledClass);
        TweenMax.set(H.$object.container, {top:0});

        if(_.isFunction(H.options.onShow)) H.options.onShow(H.callbackParams);
    };

    H.check = function() {

        if(H.options.disable) return;

        if(!H.is_mobile && H.options.hide) {
            H.hideHeader();
            ////console.log('hide header!', H.is_mobile, H.options.hide);
        } else {
            H.showHeader();
            ////console.log('show header!', H.is_mobile, H.options.hide);
        }
    };// check()

    //H.update = function(newOptions) {
    //    jQuery.extend(H.options, newOptions);
    //    get_minmax_values();
    //    //console.log('SCROLL HEADER UPDATED');
    //};//

    //------------------------------ WINDOW FUNCTIONS

    jQuery(document).ready(function() {
        init();
    });

    jQuery(window).load(function() {
        jQuery(window).trigger('resize');
    }).resize(function(e) {

        H.is_mobile = is_mobile();

        get_minmax_values();
        H.check();
        operate();

    }).scroll(function(e) {
        H.callbackParams.posY.current = window.pageYOffset;

        operate();

        H.callbackParams.posY.cached = H.callbackParams.posY.current;

    });// window.onscroll()

    //------------------------------ PRIVATE FUNCTIONS

    function operate() {
        ////console.log('operate()');

        if(_.isFunction(H.options.customOperation)) {
            H.options.customOperation(H.callbackParams);
        }// endif

        if(H.options.disable) return;

        if(H.callbackParams.posY.current > H.callbackParams.posY.cached) {
            // scrolling down // hideHeader header
////console.log('---------------------------------hide Header!');
            H.scrollDirection = 1;

            if(H.callbackParams.posY.current > H.options.absTop) H.hideHeader();

            if(_.isFunction(H.options.onScrollDown)) H.options.onScrollDown(H.callbackParams);

        } else {
            // scrolling up // showHeader header
            ////console.log('---------------------------------show Header!');

            H.scrollDirection = -1;

            if(H.minYenabled && H.callbackParams.posY.current < H.options.minY.value) {
                H.hideHeader();
            } else if(H.maxYenabled && H.callbackParams.posY.current > H.options.maxY.value) {
                H.hideHeader();
            } else {
                H.showHeader();
            }

            if(_.isFunction(H.options.onScrollUp)) H.options.onScrollUp(H.callbackParams);

        }// endif;
    }// operate()

    function get_minmax_values() {
        if(H.minYenabled) {
            H.options.minY.value = H.options.minY.target.offset().top + H.options.minY.target.outerHeight();
            ////console.log('ScrollHeader minY calculated', H.options.minY);
        }
        if(H.maxYenabled) {
            H.options.maxY.value = H.options.maxY.target.offset().top + H.options.maxY.target.outerHeight();
            ////console.log(H.options.maxY);
        }
    }// get_minmax_values()

    function get_original_top() {
        return H.options.originalTop = H.$object.container.css('top');
    }

    function init() {
        get_original_top();
        H.is_mobile = is_mobile();
        //H.check();
        operate();
    }

};// ScrollHeader()