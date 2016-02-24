function printArtists(filters,artists, $container) {

    var artistCounter = 0;

    for(var f=0; f<filters.length; f++) {
        
        for(var a=0; a<artists.length; a++) {

            console.log('COMPARING: filter('+filters[f]+') >< artist('+artists[a].title+')');

            if( slugify( filters[f] ) == slugify( artists[a].title ) ) {

                if(artistCounter > 0) {
                    $container.append(jQuery('<span class="divider">/</span>'));
                }//endif


                var artistHTML = '<span class="artist" data-img="'+ artists[a].assetUrl +'">';
                artistHTML += '<span class="label">'+ artists[a].title +'</span>';
                artistHTML += '<span class="description">'+ artists[a].body +'</span>';
                artistHTML += '</span>';
                $container.append(jQuery(artistHTML));

                artistCounter++
            }// endif

        }// endfor artists

    }// endfor filters
    
}// printArtists()