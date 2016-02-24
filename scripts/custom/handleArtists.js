var ArtistsHandler = function(url, options) {
    if(typeof url === 'undefined') return;
    if(typeof options === 'undefined') options = {};
    var AH = this;
    AH.options = jQuery.extend({
        autoInit : true,
        target : false,
        onSuccess:false,
        onError: false
    }, options);

    AH.dataReady = false;

    AH.init = function() {
        jQuery.ajax(url, {
            success:function(data) {
                if(_.isFunction(AH.options.onSuccess)) AH.options.onSuccess(data);
            },
            error:function(data) {
                if(_.isFunction(AH.options.onError)) AH.options.onError(data);
            }
        });// ajax()
    };// init()
};// ArtistsHandler()