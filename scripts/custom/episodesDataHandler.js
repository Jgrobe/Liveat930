episodesDataHandler();

function episodesDataHandler() {

    var $episodeDataDummies = jQuery('.episode-data-dummy');

    $episodeDataDummies.each(function(i){
        var $thisDummy = jQuery(this);
        console.log('thats a data-dummy with dat data', $thisDummy.data());

        var requiredEpisode = get_episode($thisDummy, _episodes);

        $thisDummy.find('.data-fill').each(function(i){
            var $thisFill = jQuery(this);
            fill_episode_data($thisFill, episode);
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

        console.log('attr-value pair constructed', attr, value);

        $elem.attr(attr, value);
    }// endfor
}// fill_episode_data()

function get_value_from_path(path, object) {
    var value = false;
    console.log('traversing path', path);

    for(var i=0; i<path.length; i++) {
        if(typeof object[path[0]] !== 'undefined') {
            var newObject  = object[path[0]],
                newPath = path.shift();
            if(newPath.length <= 0) {
                // we're at the end of the path -> return the value
                value = object[path[0]];
            } else {
                // there's still way to go -> keep traversing
                value = get_value_from_path(newPath, newObject);
            }
        }// endif
    }// endfor

    return value;
}// get_value_from_path()

function get_episode($dummy, episodes) {
    var filter = $dummy.data('filter').split('=');
    var attr = filter[0], val = filter[1];
    var episode, filtermatch = false;

    for(var i=0; i<episodes.length; i++) {
        var episode = episodes[i];
        if(typeof ep[attr] === 'undefined') continue;

        for(var j=0; j<ep[attr].length; j++) {
            if(ep[attr] === val) filtermatch = true;
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
    console.log('------camelCased', input, output);

    return output;
}// camelCase