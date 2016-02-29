/*
* Dependencies:
* jQuery
* lodash
* */
var AjaxSearch = function($container, options) {
    if(typeof $container === 'undefined') return;
    if(typeof options === 'undefined') options = {};
    var AS = this;
    AS.options = {
        autoInit : true,
        searchPath: '/search',
        onSuccess : false,
        onError : false,
        resultSelector: '.search-result',
        extractionMatrix: {
            image : {
                selector : 'img',
                value : ''
            }
        }
    };

    AS.init = function() {
    };// init()
    
    AS.extractData = function(data) {

        var extractedResults = [],
            $results = jQuery(data).find(AS.options.resultSelector);

        $results.each(function(i) {
            var result = {};

            for(var attr in AS.options.extractionMatrix) {

            }// endfor

            extractedResults.push(result);
        });// endeach(results)

    };// extractData
    
    AS.search = function(query) {
        
        jQuery.ajax(AS.options.searchPath, {
            success: function(data) {
                
                AS.results = AS.extractData(data);
                
                if(_.isFunction(AS.options.onSuccess)) AS.options.onSuccess(data, AS.results);
            },
            error : function() {
                
            }
        })
        
    };// search()
    
    if(AS.options.autoInit) AS.init();
    
    
};// SiteSearch