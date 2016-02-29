/*
* Dependencies:
* jQuery
* lodash
* */
var AjaxSearch = function(options) {
    if(typeof options === 'undefined') options = {};
    var AS = this;
    AS.options = {
        autoInit : true,
        searchPath: '/search',
        onSuccess : false,
        onError : false,
        resultSelector: '.search-result'
    };

    AS.init = function() {
    };// init()
    
    AS.extractData = function(data) {

        var extractedResults = [],
            $results = jQuery(data).find(AS.options.resultSelector);

        $results.each(function(i) {
            var $thisResult = jQuery(this);
            var result = {
                img : $thisResult.find('img').attr('src'),
                title : $thisResult.find('.sqs-title').html()
            };

            extractedResults.push(result);
        });// endeach(results)

        return extractedResults;

    };// extractData
    
    AS.search = function(query) {

        console.log('search()', query);
        
        jQuery.ajax((AS.options.searchPath +'?q='+ query), {
            success: function(data) {
                
                AS.results = AS.extractData(data);

                console.log('success()', AS.results);

                if(_.isFunction(AS.options.onSuccess)) AS.options.onSuccess(data, AS.results);
            },
            error : function() {
                
            }
        })
        
    };// search()
    
    if(AS.options.autoInit) AS.init();
    
    
};// SiteSearch