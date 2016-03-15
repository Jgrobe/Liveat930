episodesDataHandler();

function episodesDataHandler() {

    var $episodeDataDummies = jQuery('.episode-data-dummy');

    $episodeDataDummies.each(function(i){
        var $thisDummy = jQuery(this);
        $thisDummy.removeClass('episode-data-dummy');
        console.log('thats a data-dummy with dat data', $thisDummy.data());

        var requiredEpisode = get_episode($thisDummy, _episodes);

        $thisDummy.find('.data-fill').each(function(i){
            var $thisFill = jQuery(this);
            fill_episode_data($thisFill, requiredEpisode);
        });
    });

}// episodesHandler

function fill_episode_data($elem, episode) {
    var attrs = $elem.data('attr').split(',');
    for(var i=0; i<attrs.length; i++) {
        var pair = attrs[i].split('=');
        var dataPath = pair[0].split('.');
        var attr = pair[1];

        var value = get_value_from_path(dataPath, episode);

        //console.log('attr-value pair constructed', attr, value);

        $elem.attr(attr, value);

        if(i >= attrs.length-1) {
            $elem.removeAttr('data-attr');
            followUpDataConverter($elem);
        }

    }// endfor

}// fill_episode_data()

function followUpDataConverter($elem) {
    var data = $elem.data();

    for(var attr in data) {
        switch(attr) {
            case 'html' :
                $elem.html(data[attr]);
                break;
            case 'bgimgurl' :
                $elem.css({
                    'background-image' : 'url(\'' + data[attr] + '\')'
                });
                break;
        }// endswitch
    }// endfor
}// followUpDataConverter()

function get_value_from_path(path, object) {// iteration through episode data tree
    //console.log('start traversing path', path, object);
    var value = object[path[0]];
    //console.log('current value', value);

    if(path.length > 1) {
        //var newObject  = value;
        path.shift();
        //console.log('new path', path);
        value = get_value_from_path(path, value);
    }// endif

    return value;
}// get_value_from_path()

function get_episode($dummy, episodes) {
    var filter = $dummy.data('filter').split('=');
    var attr = filter[0], val = filter[1];
    var episode, filtermatch = false;

    for(var i=0; i<episodes.length; i++) {
        episode = episodes[i];
        if(typeof episode[attr] === 'undefined') continue;

        for(var j=0; j<episode[attr].length; j++) {
            var cat = episode[attr][j];
            console.log('comparing categories', cat, val, episode[attr] === val );
            if(cat === val) filtermatch = true;
        }// endfor

        if(filtermatch) break;
    }// endfor

    console.log('episode found', episode);

    return episode;
}

function camelCase(input, divider) {
    if(typeof divider === 'undefined') divider = '-';
    var process =  input.split(divider);
    var output = process.map(function(v,i){
        if(i>0) v = v.charAt(0).toUpperCase();
        return v;
    });
    output = output.join();
    //console.log('------camelCased', input, output);

    return output;
}// camelCase