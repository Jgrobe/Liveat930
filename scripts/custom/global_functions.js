// fallback for browsers that dont support window.getComputedStyle as used in get_breakpoint()
if (!window.getComputedStyle) {
    window.getComputedStyle = function(el, pseudo) {
        this.el = el;
        this.getPropertyValue = function(prop) {
            var re = /(\-([a-z]){1})/g;
            if (prop == 'float') prop = 'styleFloat';
            if (re.test(prop)) {
                prop = prop.replace(re, function () {
                    return arguments[2].toUpperCase();
                });
            }
            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        };
        return this;
    }
}


// FASTCLICK \\
jQuery(function() {
    FastClick.attach(document.body);
});

function get_breakpoint() {
    var breakpoint = window.getComputedStyle(document.body, ':after').getPropertyValue('content');
    if(breakpoint != undefined) {
        return breakpoint.replace(/["']*/g, '');
    }
}// end get_breakpoint()

function is_mobile(breakpoint) {

    //console.log('-------------------- is_Mobile()',get_breakpoint());
    if(breakpoint == undefined) breakpoint = 'mobile';

    if(breakpoint != get_breakpoint()) {
        return false;
    } else {
        return true;
    }
}// end is_mobile()

function elem_exists($elem) {
    return $elem.length > 0;
}// elem_exists

function prefix_int(number, places) {
    if(typeof places === 'undefined') places = 1;
    //var numberplaces = number.split();
    var prefix = '';
    for(var i=1; i <= places; i++) {
        if(number < 10*i) prefix += '0';
    }// endfor

    return (prefix + number);
}// prefix_int()

jQuery.fn.hasAttr = function(name) {
    var attr = jQuery(this).attr(name);
    return (typeof attr !== typeof undefined && attr !== false);
};// hasAttr()

function getUriParams(param) {
    var get_single_param = (typeof param !== 'undefined'), single_param = false;
    var query_string = {};
    var query = window.location.search.substring(1);
    var parmsArray = query.split('&');
    if(parmsArray.length <= 0) return query_string;
    for(var i = 0; i < parmsArray.length; i++) {
        var pair = parmsArray[i].split('=');
        var key = pair[0],
            val = decodeURIComponent(pair[1]);
        if( get_single_param && param === key) {
            single_param = val;
            break;
        }
        if (val != '' && pair[0] != '') query_string[pair[0]] = val;
    }
    if(get_single_param) return single_param;
    return query_string;
}// getUriParams()

function size_video(done) {
    //console.log('size_video fired');
    jQuery('video, .video-sizeable').each(function(){
        var $video = jQuery(this);
        if($video.hasClass('no_size_video')) return true;

        var $container = $video.parent();
        var video = {
            width: $video.get(0).videoWidth,
            height: $video.get(0).videoHeight
        };
        //console.log('VIDEO RESIZE()', video);
        //if($video.hasAttr('data-ratio')) {
        //    var ratio = $video.attr('data-ratio').split(',');
        //    video.width = parseFloat(ratio[0]);
        //    video.height = parseFloat(ratio[1]);
        //    ////console.log('custom video ratio', video);
        //}// endif
        var scaleFactor = Math.max($container.width()/video.width,$container.height()/(video.height/* - binaryOffset*2*/));
        var newWidth = video.width*scaleFactor;
        var newHeight = video.height*scaleFactor;
        var offsetX = ($container.width()-newWidth) *.5;
        var offsetY = ($container.height()-newHeight) *.5;
        $video.css({
            width: newWidth,
            height: newHeight,
            left:offsetX,
            top:(offsetY)
            //display: ''
        });// 14px = height of binary strip

        if(_.isFunction(done)) done(newWidth, newHeight, offsetX, offsetY);
    });
    ////console.log('size_video()');
}

function preload_images(images, functions) {
    if(typeof functions === 'undefined') functions = {};
    var loaded = 0;
    for(var i=0; i<images.length; i++) {
        ////console.log('preload '+images[i]);
        var img = new Image();
        img.onload = img.onerror = function() {
            ////console.log(img.src + ' loaded');
            var onImgParams = {
                //img : img,
                //index : i,
                loadedPct : (loaded / images.length)
            };
            if( _.isFunction(functions.onImgLoad) ) functions.onImgLoad(onImgParams);

            loaded++;
            if(loaded >= images.length && _.isFunction(functions.onAllImgsLoaded)) {
                ////console.log('all imgs loaded');
                functions.onAllImgsLoaded()
            }
        };
        img.src = images[i];
    }// endfor
}// preload_images()

function lock($target, height) {
    ////console.log('LOCKED!');
    $target.css({
        height: height,
        overflow: 'hidden'
    });
}

function unlock($target, height) {
    ////console.log('UNLOCKED!');
    if(typeof height === 'undefined') height ='';
    $target.css({
        height: height,
        overflow: ''
    });
}

//function add_imgs_to_preload_stack(imgs, stack) {
//    for(var i=0; i<imgs.length; i++) {
//        stack.push(imgs[i].src);
//    }
//    //console.log('stack upped', BUNDY.images);
//}// add_imgs_to_preload_stack()

function extract_imgsrc(source) {
    var imgsrcs = [];

    for(var key in source) {
        ////console.log('item', key);
        if(!source.hasOwnProperty(key)) continue;
        if($.inArray(key, ['video','videos', 'galleries']) ) continue;

        var value = source[key];
        if(key === 'src' && typeof value === 'string') {
            imgsrcs.push(value);
        } else if(_.isObject(value) && !_.isFunction(value)) {
            var deeperimgs = extract_imgsrc(value);
            imgsrcs = imgsrcs.concat(deeperimgs);
        }// endif

        ////console.log('value', value);
    }// endfor

    ////console.log('final imgsrcs', imgsrcs);
    return imgsrcs;
}// extract_imgsrc()

function get_preload_sources() {
    var srcs = [];
    jQuery('img, .img, .imgfill').each(function() {
        var $this = jQuery(this);
        if($this.hasAttr('src')) srcs.push($this.attr('src'));
        if($this.hasAttr('style')) {
            var style = $this.get(0).currentStyle || window.getComputedStyle($this.get(0), false);
            var src = style.backgroundImage.slice(4, -1).replace(/"/g, "");
            srcs.push(src);
        }
    });
    ////console.log('found img srcs: ', srcs);
    return srcs;
}

function slugify(input) {
    //console.log('slugify()', input);
    var vowelMap = {
        'Ä':'ae',
        'ä' : 'ae',
        'Ö' : 'oe',
        'ö' : 'oe',
        'Ü' : 'ue',
        'ü' : 'ue',
        ' ' : '',
        '_' : '',
        '-' : ''
    };
    var output = input.replace(new RegExp(Object.keys(vowelMap).join("|"),"gi"), function(matched){
        return vowelMap[matched];
    }).toLowerCase();
    return output;
}// slugify()

function strip_tags(input, allowed) {

    allowed = (((allowed || '') + '')
        .toLowerCase()
        .match(/<[a-z][a-z0-9]*>/g) || [])
        .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
        commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '')
        .replace(tags, function($0, $1) {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
        });
}// strip_tags
