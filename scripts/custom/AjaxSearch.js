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
        searchPath: '/api/search/GeneralSearch',
        onSuccess : false,
        onError : false,
        resultSelector: '.search-result',
        exclude : {collectionDisplayName:'Artists'}
    }, options);
    
    AS.extractData = function(data) {

        console.log('search results', data);

        var extractedResults = [],
            searchItems = data.items;
        console.log('results found', data, searchItems);


        for(var i=0; i<searchItems.length; i++) {
            var thisItem = searchItems[i];
            //console.log('filtering result', $thisItem, $thisItem.get(0));

            var exclude = false;
            if(AS.options.exclude) {
                for(var attr in AS.options.exclude) {
                    if(typeof thisItem[attr] !== 'undefined' && thisItem[attr] == AS.options.exclude[attr]) {
                        console.log('exclude this from search: '+attr+' : '+thisItem[attr]);
                        exclude = true;
                    }// endif
                }// endfor

                if(exclude) continue;
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

                console.log('success() raw data', data);
                
                AS.results = AS.extractData(data);
                console.log('success() extracted data', AS.results);

                if(_.isFunction(AS.options.onSuccess)) AS.options.onSuccess(query, data, AS.results);
            },
            error : function(data) {
                console.log('ajax error', data);
            }
        });
        
    };// search()

    AS.init = function() {
    };// init()
    
    if(AS.options.autoInit) AS.init();
    
    
};// SiteSearch