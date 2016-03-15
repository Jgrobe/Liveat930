episodesDataHandler();

function episodesDataHandler() {

    var $episodeDataDummies = jQuery('.episode-data-dummy');

    $episodeDataDummies.each(function(i){
        var $thisDummy = jQuery(this);
        console.log('thats a data-dummy with dat data', $thisDummy.data());
    });

}// episodesHandler