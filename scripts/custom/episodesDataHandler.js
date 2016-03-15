episodesDataHandler();

function episodesDataHandler() {

    var $episodeDataDummies = jQuery('.episode-data-dummy');

    $episodeDataDummies.each(function(i){
        var $thisDummy = jQuery(this);
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

        console.log('attr-value pair constructed', attr, value);

        $elem.attr(attr, value);
    }// endfor
}// fill_episode_data()

function get_value_from_path(path, object) {
    console.log('start traversing path', path, object);
    var value = object[path[0]];
    console.log('current value', value);

    if(path.length > 1) {
        var newObject  = value;
        path.shift();
        console.log('new path', path);
        value = get_value_from_path(path, newObject);
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
            console.log('comparing categories', episode[attr], val, episode[attr] === val );
            if(episode[attr] === val) filtermatch = true;
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