SQSP.functions.createPageGallery = function() {

    var $galleryContainer = jQuery('.gallery-container');

    if(!elem_exists($galleryContainer)) return;

    SQSP.instances.PageGallery = new ImageGallery($galleryContainer, {
        images : conform_gallery_data(_gallery)// _gallery is declared inline
    });
};

function conform_gallery_data(gallery) {
    var conformed_gallery = [];

    for(var i=0;i<gallery.length; i++) {
        conformed_gallery.push({
            src: gallery[i].assetUrl,
            title : gallery[i].title,
            copy : (typeof gallery[i].body.html !== 'undefined' ? gallery[i].body.html : false)
        });
    }// endfor

    return conformed_gallery;
}// conform_gallery_data()