/*
* Dependencies:
* jQuery
* lodash
* */
var AjaxSearch = function(options) {
    if(typeof options === 'undefined') options = {};
    var AS = this;
    AS.options = jQuery.extend({
        autoInit : true,
        searchPath: '/search',
        onSuccess : false,
        onError : false,
        resultSelector: '.search-result',
        exclude : {collectionDisplayName:'Artists'}
    }, options);

    AS.init = function() {
    };// init()
    
    AS.extractData = function(data) {

        console.log('search results', data);

        var extractedResults = [],
            searchItems = data.items;
        console.log('results found', data, results);


        for(var i=0; i<searchItems.length; i++) {
            var thisItem = searchItems[i];
            //console.log('filtering result', $thisItem, $thisItem.get(0));

            if(AS.options.exclude) {
                for(var attr in AS.options.exclude) {
                    if(typeof thisItem[attr] !== 'undefined' && thisItem[attr] == AS.options.exclude[attr]) {
                        console.log('exclude this from search: '+attr+' : '+thisItem[attr]);
                        continue;
                    }// endif
                }// endfor
            }// endif

            var result = {
                img : thisItem.imageUrl,
                title : strip_tags( thisItem.title ),
                href : thisItem.itemUrl
            };

            extractedResults.push(result);
        }// endfor

        return extractedResults;

    };// extractData
    
    AS.search = function(query) {

        console.log('search()', query, AS.options.searchPath);
        
        jQuery.ajax(AS.options.searchPath, {
            method : 'get',
            data : {q: query},
            success: function(data) {
                
                AS.results = AS.extractData(data);

                console.log('success()', AS.results);

                if(_.isFunction(AS.options.onSuccess)) AS.options.onSuccess(query, data, AS.results);
            },
            error : function(data) {
                console.log('ajax error', data);
            }
        });
        
    };// search()
    
    if(AS.options.autoInit) AS.init();
    
    
};// SiteSearch