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

        var cachedHtml = jQuery('<div/>').html(data);
        var extractedResults = [],
            $results = cachedHtml.find(AS.options.resultSelector);
        //console.log('results found', data, $results);

        $results.each(function(i) {
            var $thisResult = jQuery(this);
            //console.log('filtering result', $thisResult, $thisResult.get(0));
            var result = {
                img : $thisResult.find('img').data('src'),
                title : strip_tags( $thisResult.find('.sqs-title').html() ),
                href : $thisResult.data('url')
            };

            extractedResults.push(result);
        });// endeach(results)

        return extractedResults;

    };// extractData
    
    AS.search = function(query) {

        //console.log('search()', query);
        
        jQuery.ajax((AS.options.searchPath +'?q='+ query), {
            success: function(data) {
                
                AS.results = AS.extractData(data);

                //console.log('success()', AS.results);

                if(_.isFunction(AS.options.onSuccess)) AS.options.onSuccess(query, data, AS.results);
            },
            error : function() {
                
            }
        })
        
    };// search()
    
    if(AS.options.autoInit) AS.init();
    
    
};// SiteSearch