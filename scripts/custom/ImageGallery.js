var ImageGallery = function($container, options) {
    if(typeof $container === 'undefined') return;

    var IG = this;

    var defaults = {
        type : 'multiple', // multiple | single | products
        title : false,
        numerizeButtons: true,
        images : [],
        toggleDuration :.6,
        duration:.25,
        imageSelector : '.gallery-img',
        arrowSelector : '.arrow',
        buttonSelector : '.gallery-btn',
        indicatorSelector: '.gallery-indicator',
        galleryLabelSelector : '.gallery-label',
        imageLabelSelector : '.image-label',
        imageCopySelector : '.image-copy',
        activeClass : 'current-item',
        multiGalleryInstance: false
    };
    if(typeof options !== 'undefined') jQuery.extend(defaults, options);
    IG.options = defaults;

    IG.$object = {
        container : $container,
        image : $container.find(IG.options.imageSelector),
        arrows : $container.find(IG.options.arrowSelector),
        buttons : $container.find(IG.options.buttonSelector),
        indicator : $container.find(IG.options.indicatorSelector),
        galleryLabel : $container.find(IG.options.galleryLabelSelector),
        imageLabel : $container.find(IG.options.imageLabelSelector),
        imageCopy : $container.find(IG.options.imageCopySelector)
    };
    IG.is_arrows_initialized = false;

    //IG.setup = function(images) {
    //
    //    if(typeof images === 'undefined' || images.length <= 0) return false;
    //    IG.options.images = preloadImages(images);
    //
    //    IG.$object.image.css({
    //        'background-image' : 'url(' + IG.options.images[IG.currentIndex].src + ')'
    //    });
    //    var $btns = IG.$object.buttonsContainer.children();
    //    var $btn = $btns.first().removeClass('current-item').clone();
    //    $btns.remove();
    //    for(var i=0; i<IG.options.images.length; i++) {
    //        var $newBtn = $btn.clone();
    //        if(i === IG.currentIndex) $newBtn.addClass('current-item');
    //        $newBtn.html( prefix_int(i+1) );
    //        IG.$object.buttonsContainer.append($newBtn);
    //    }// endfor
    //
    //    return true;
    //};// setup()

    IG.arrowClick = function(e) {
        e.preventDefault();
        var $clicked = jQuery(e.currentTarget);
        if($clicked.hasClass('prev')) {
            IG.currentIndex--;
            if(IG.currentIndex < 0) IG.currentIndex = IG.options.images.length -1;
        } else if($clicked.hasClass('next')) {
            IG.currentIndex++;
            if(IG.currentIndex >= IG.options.images.length) IG.currentIndex = 0;
        }

        IG.switchImage(IG.currentIndex);
    };// arrowClick()

    IG.buttonClick = function(e) {
        e.preventDefault();
        var $clicked = jQuery(e.currentTarget);
        IG.currentIndex = $clicked.index();

        IG.switchImage(IG.currentIndex);
    };// buttonClick()

    IG.switchImage = function(index, functions) {
        if(typeof functions === 'undefined') functions = {};
        ////console.log('switchImage functions:', functions);
        IG.currentIndex = index;

        var tl = new TimelineMax();
        tl.to(IG.$object.image, IG.options.duration, {autoAlpha:0});
        tl.add(function() {
            IG.$object.image.css({
                'background-image' : 'url(' + IG.options.images[index].src + ')'
            });
        });
        tl.to(IG.$object.image, IG.options.duration, {autoAlpha:1});
        tl.add(function() {
            ////console.log('switchImage complete!', functions);
            if(_.isFunction(functions.onComplete)) functions.onComplete();
        });

        tl.add( update_buttons(), 0 );
        tl.add( update_imageLabel(), 0 );
        tl.add( update_imageCopy(), 0 );
        tl.add( update_selectList(), 0 )
    };// switchImage()

    IG.getObjects = function() {
        build_buttons();

        IG.$object.buttons.click(function(e){
            IG.buttonClick(e);
        });

        if(!IG.is_arrows_initialized) {
            IG.$object.arrows.click(function(e) {
                IG.arrowClick(e);
            });
            IG.is_arrows_initialized = true;
        }
    };// getObjects()

    // INIT

    IG.init = function(imgs, functions) {
        if(typeof imgs !== 'undefined') {
            IG.options.images = imgs;
            ////console.log('images switched', IG.options.images);
        }
        if(typeof functions === 'undefined') functions = {};

        IG.currentIndex = 0;
        preloadImages(IG.options.images);
        IG.getObjects();
        IG.switchImage(IG.currentIndex, {
            onComplete: function() {
                ////console.log('gallery switchImage complete:');
                if(_.isFunction(functions.onComplete)) functions.onComplete();
            }
        });
        ////console.log('IG.options.title', IG.options.title, 'IG.$object.galleryLabel', IG.$object.galleryLabel.html());
        if(IG.options.title && elem_exists(IG.$object.galleryLabel)) {
            IG.$object.galleryLabel.html(IG.options.title);
        }// endif

        //console.log('Image Gallery init()', IG);
    };// init()

    IG.init();

    // PRIVATE FUNCTIONS

    function build_buttons() {
        if(IG.options.type !== 'multiple') return false;
        ////console.log('build_buttons()', IG.$object.buttons);
        var $button = IG.$object.buttons.first().clone().removeClass(IG.options.activeClass);
        var $buttonContainer = IG.$object.buttons.parent();
        IG.$object.buttons.remove();
        for(var i=0; i<IG.options.images.length; i++) {
            var $newButton = $button.clone();
            if(IG.options.numerizeButtons) $newButton.html(prefix_int(i+1)).attr({'data-index' : i});
            if(i === IG.currentIndex) $newButton.addClass(IG.options.activeClass);
            $buttonContainer.append($newButton);
        }// endfor
        IG.$object['buttons'] = IG.$object.container.find(IG.options.buttonSelector);
    }

    function update_buttons() {
        //console.log('update_buttons()');
        IG.$object.buttons.removeClass('current-item');
        jQuery(IG.$object.buttons.get(IG.currentIndex)).addClass('current-item');

        if(!elem_exists(IG.$object.indicator)) return 'null'; // must be tween, timeline, fn or string b/c inserted into timeline

        var indTL = new TimelineMax();
        indTL.to(IG.$object.indicator, IG.options.duration, {autoAlpha:0});
        indTL.add(function() {
            IG.$object.indicator.html(prefix_int(IG.currentIndex+1));
        });
        indTL.to(IG.$object.indicator, IG.options.duration, {autoAlpha:1});

        return indTL;
    }// update_buttons()

    function update_imageLabel() {
        ////console.log('update_imageLabel()', IG.options.images[IG.currentIndex].title);
        if(!elem_exists(IG.$object.imageLabel) || typeof IG.options.images[IG.currentIndex].description === 'undefined') return 'null'; // must be tween, timeline, fn or string b/c inserted into timeline

        var labelTL = new TimelineMax();
        labelTL.to(IG.$object.imageLabel, IG.options.duration, {autoAlpha:0});
        labelTL.add(function() {
            IG.$object.imageLabel.html(IG.options.images[IG.currentIndex].description);
        });
        labelTL.to(IG.$object.imageLabel, IG.options.duration, {autoAlpha:1});

        return labelTL;
    }// update_imageLabel()

    function update_imageCopy() {
        if(!elem_exists(IG.$object.imageCopy) || typeof IG.options.images[IG.currentIndex].copy === 'undefined') return 'null'; // must be tween, timeline, fn or string b/c inserted into timeline
        //console.log('------- update_imageCopy()');

        var copyTL = new TimelineMax();
        copyTL.to(IG.$object.imageCopy, IG.options.duration, {autoAlpha:0});
        copyTL.add(function() {
            IG.$object.imageCopy.html(IG.options.images[IG.currentIndex].copy);
        });
        copyTL.to(IG.$object.imageCopy, IG.options.duration, {autoAlpha:1});

        return copyTL;
    }// update_imageCopy()

    function update_selectList() {
        if(!IG.options.multiGalleryInstance || IG.options.type !== 'products') return 'null'; // must be tween, timeline, fn or string b/c inserted into timeline

        return function() {
            IG.options.multiGalleryInstance.updateSelect(IG.currentIndex);
        };//fn
    }// update_selectList()

    function preloadImages(imgs) {
        var loadedImgs = [];
        for(var i=0; i<imgs.length; i++) {
            var img = new Image();
            //img.onload = function() {//console.log('Image preloaded!');};
            img.src = imgs[i].src;
            loadedImgs.push(img);
        }// endfor
        return loadedImgs;
    }// preloadImages()

};// ImageGallery()