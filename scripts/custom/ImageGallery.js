/**
 *Dependencies:
 *
 * jQuery
 * lodash
 * touchswipe
 * GSAP
 */
var ImageGallery = function($container, options) {
    if(typeof $container === 'undefined') return;
    if(typeof options === 'undefined') options = {};
    var IG = this;

    IG.options = jQuery.extend({
        images : [],
        duration:.25,
        imageSelector : '.gallery-image',
        imageTitleSelector : '.gallery-title',
        imageCopySelector : '.gallery-copy',
        arrowSelector : '.arrow',
        labelCurrentSelector: '.gallery-current',
        labelTotalSelector: '.gallery-total',
        ctaSelector : '.cta-container',
        activeClass : 'current-item',
        currentIndex : 0
    }, options);

    IG.$object = {
        container : $container,
        image : $container.find(IG.options.imageSelector),
        imageTitle : $container.find(IG.options.imageTitleSelector),
        imageCopy : $container.find(IG.options.imageCopySelector),
        arrows : $container.find(IG.options.arrowSelector),
        labelCurrent: $container.find(IG.options.labelCurrentSelector),
        labelTotal: $container.find(IG.options.labelTotalSelector),
        cta: $container.find(IG.options.ctaSelector)
    };
    IG.is_arrows_initialized = false;
    IG.lastDirection = 'next';

    //IG.setup = function(images) {
    //
    //    if(typeof images === 'undefined' || images.length <= 0) return false;
    //    IG.options.images = preloadImages(images);
    //
    //    IG.$object.image.css({
    //        'background-image' : 'url(' + IG.options.images[IG.options.currentIndex].src + ')'
    //    });
    //    var $btns = IG.$object.buttonsContainer.children();
    //    var $btn = $btns.first().removeClass('current-item').clone();
    //    $btns.remove();
    //    for(var i=0; i<IG.options.images.length; i++) {
    //        var $newBtn = $btn.clone();
    //        if(i === IG.options.currentIndex) $newBtn.addClass('current-item');
    //        $newBtn.html( prefix_int(i+1) );
    //        IG.$object.buttonsContainer.append($newBtn);
    //    }// endfor
    //
    //    return true;
    //};// setup()

    IG.leftright = function(direction, functions) {
        if(typeof functions === 'undefined') functions = {};


        var $imagesToUse = is_mobile() ? IG.$object.image.eq(0) : IG.$object.image;
        //console.log('galleryy images to use', $imagesToUse, IG.$object.image);

        if(IG.lastDirection !== direction) {
            // equalize index in case of direction change on multiple imageContainers
            // so it jumps over currently displayed image
            IG.options.currentIndex += ( direction == 'next' ? ($imagesToUse.length - 1) : -($imagesToUse.length - 1) );
        }// endif

        IG.lastDirection = direction;
        var $images = direction == 'next' ? $imagesToUse : jQuery($imagesToUse.get().reverse());

        $images.each(function(){

            var $thisImg = jQuery(this);

            switch(direction) {
                case 'next' :
                    IG.options.currentIndex++;
                    if(IG.options.currentIndex >= IG.options.images.length) IG.options.currentIndex = 0;
                    break;
                case 'prev' :
                    IG.options.currentIndex--;
                    if(IG.options.currentIndex < 0) IG.options.currentIndex = IG.options.images.length -1;
                    break;
            }// endswitch


            //console.log('updating image index', IG.options.currentIndex );

            IG.switchImage($thisImg, IG.options.currentIndex, functions);

        });// endeach()
    };

    //IG.arrowClick = function(e) {
    //    e.preventDefault();
    //    var $clicked = jQuery(e.currentTarget);
    //    if($clicked.hasClass('prev')) {
    //        IG.options.currentIndex--;
    //        if(IG.options.currentIndex < 0) IG.options.currentIndex = IG.options.images.length -1;
    //    } else if($clicked.hasClass('next')) {
    //        IG.options.currentIndex++;
    //        if(IG.options.currentIndex >= IG.options.images.length) IG.options.currentIndex = 0;
    //    }
    //
    //    IG.switchImage(IG.options.currentIndex);
    //};// arrowClick()

    IG.switchImage = function($img, index, functions) {
        if(typeof $img === 'undefined' || $img === false) $img = IG.$object.image;
        if(typeof functions === 'undefined') functions = {};
        ////console.log('switchImage functions:', functions);
        IG.options.currentIndex = index;

        var tl = new TimelineMax();
        tl.to($img, IG.options.duration, {autoAlpha:0});
        tl.add(function() {
            $img.css({
                'background-image' : 'url(' + IG.options.images[index].src + ')'
            });
        });
        tl.to($img, IG.options.duration, {autoAlpha:1});
        tl.add(function() {
            ////console.log('switchImage complete!', functions);
            if(_.isFunction(functions.onComplete)) functions.onComplete();
        });

        tl.add( update_imageCounter(), 0 );
        tl.add( update_imageTitle(), 0 );
        tl.add( update_imageCopy(), 0 );
        tl.add( update_cta(), 0 );
    };// switchImage()


    // INIT

    IG.init = function(functions) {
        //console.log('Image Gallery init()', IG);

        if(typeof functions === 'undefined') functions = {};

        preloadImages(IG.options.images);
        IG.options.currentIndex--;
        IG.leftright(IG.lastDirection, {
            onComplete: function() {
                ////console.log('gallery switchImage complete:');
                if(_.isFunction(functions.onComplete)) functions.onComplete();
            }
        });
        //IG.switchImage(false, IG.options.currentIndex, {
        //    onComplete: function() {
        //        ////console.log('gallery switchImage complete:');
        //        if(_.isFunction(functions.onComplete)) functions.onComplete();
        //    }
        //});

        IG.$object.labelTotal.html(IG.options.images.length);

        IG.$object.arrows.click(function(e) {
            e.preventDefault();
            var $clicked = jQuery(this);
            IG.leftright( $clicked.hasClass('prev') ? 'prev' : 'next');
        });

        IG.$object.container.swipe({
            allowPageScroll:"auto",
            swipe:function(e, direction) {
                switch(direction) {
                    case 'left' :
                        IG.leftright('next');
                        break;
                    case 'right' :
                        IG.leftright('prev');
                        break;
                }// endswitch
            }
        });// swipe

    };// init()

    IG.init();

    // PRIVATE FUNCTIONS

    function update_imageTitle() {
        ////console.log('update_imageTitle()', IG.options.images[IG.options.currentIndex].title);
        //console.log('update_imageTitle', 'images', IG.options.images, 'index', IG.options.currentIndex);
        if(!elem_exists(IG.$object.imageTitle) || typeof IG.options.images[IG.options.currentIndex].title === 'undefined') return 'null'; // must be tween, timeline, fn or string b/c inserted into timeline

        var labelTL = new TimelineMax();
        labelTL.to(IG.$object.imageTitle, IG.options.duration, {autoAlpha:0});
        labelTL.add(function() {
            IG.$object.imageTitle.html(IG.options.images[IG.options.currentIndex].title);
        });
        labelTL.to(IG.$object.imageTitle, IG.options.duration, {autoAlpha:1});

        return labelTL;
    }// update_imageTitle()

    function update_imageCopy() {
        if( !elem_exists(IG.$object.imageCopy) ) return 'null'; // must be tween, timeline, fn or string b/c inserted into timeline
        //console.log('------- update_imageCopy()');

        // >> used for dynamic box heightening
        var oldHeight = IG.$object.imageCopy.height();
        var newHeight;
        // << used for dynamic box heightening

        var copyTL = new TimelineMax();
        copyTL.to(IG.$object.imageCopy, IG.options.duration, {autoAlpha:0});

        copyTL.add(function() {
            // >> used for dynamic box heightening
            IG.$object.imageCopy.height('auto');
            // <<

            IG.$object.imageCopy.html(IG.options.images[IG.options.currentIndex].copy);

            // >> used for dynamic box heightening
            newHeight = IG.$object.imageCopy.height();
            IG.$object.imageCopy.height(oldHeight);

            copyTL.to(IG.$object.imageCopy, IG.options.duration, {height:newHeight, ease:Strong.easeOut});
            // <<

            copyTL.to(IG.$object.imageCopy, IG.options.duration, {autoAlpha:1});
        });

        return copyTL;
    }// update_imageCopy()

    function update_imageCounter() {
        if( !elem_exists(IG.$object.labelCurrent) ) return 'null'; // must be tween, timeline, fn or string b/c inserted into timeline

        var labelTL = new TimelineMax();
        labelTL.to(IG.$object.labelCurrent, IG.options.duration, {autoAlpha:0});
        labelTL.add(function() {
            IG.$object.labelCurrent.html(IG.options.currentIndex+1);
        });
        labelTL.to(IG.$object.labelCurrent, IG.options.duration, {autoAlpha:1});
        return labelTL;
    }

    function update_cta() {
        if( !elem_exists(IG.$object.cta) ) return 'null'; // must be tween, timeline, fn or string b/c inserted into timeline
        if(typeof IG.options.images[IG.options.currentIndex].href === 'undefined') return 'null';

        var ctaTL = new TimelineMax();
        //ctaTL.to(IG.$object.labelCurrent, IG.options.duration, {autoAlpha:0});
        ctaTL.add(function() {
            IG.$object.cta.attr({
                href :IG.options.images[IG.options.currentIndex].href
            });
        });
        //ctaTL.to(IG.$object.labelCurrent, IG.options.duration, {autoAlpha:1});
        return ctaTL;
    }


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