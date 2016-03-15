var ctaVars = ['class', 'icon', 'label', 'hover', 'tag', 'attributes'];
jQuery('.cta-dummy').each(function() {
    var $this = jQuery(this);
//            //console.log('this is cta converter', $this.data('icon'));
    var ctaOpts = {};
    for(var k=0; k< ctaVars.length; k++) {
        //console.log('proofing '+ctaVars[k], 'attr '+'data-'+ctaVars[k], $this.hasAttr('data-'+ctaVars[k]));

        if(!$this.hasAttr('data-'+ctaVars[k])) continue;

        if(ctaVars[k] == 'icon') {
            ctaOpts['icon'] = {
                title : $this.data(ctaVars[k]),
                html : $this.html()
            };
        } else {
            ctaOpts[ctaVars[k]] = $this.data(ctaVars[k]);
        }
    };
    //console.log('input cta opts');
    var $CTA = jQuery(get_cta_html(ctaOpts));
    $this.replaceWith($CTA);
});


function get_cta_html(options) {
    var settings = jQuery.extend({
        'class': false,
        'icon': false,
        'label': false,
        'hover': false,
        'tag': 'a',
        'attributes': 'href=#'
    }, options);
    //console.log('cta opts', options, 'cta settings', settings);

    var ctaHTML = '<' + settings.tag + ' class="cta-container';
    if (!settings.label) ctaHTML += ' no-label';
    if (settings.icon) ctaHTML += ' icon-' + settings.icon.title;
    if (settings.class) ctaHTML += ' ' + settings.class;
    ctaHTML += '"';
    if (settings.attributes) {
        var pairs = settings.attributes.split(',');
        for (var i = 0; i < pairs.length; i++) {
            var data = pairs[i].split('=');
            ctaHTML += ' ' + data[0] + '="' + data[1].replace('::', '=') + '"';
        }// endfor
    }//endif
    ctaHTML += '>';

    var numElems = (settings.hover !== false) ? 1 : 2;
    //console.log('is hover?', settings.hover, numElems);
    for (var j = 0; j < numElems; j++) {

        var ctaElem = '<div class="cta';
        if (j > 0) ctaElem += ' hover-cta';
        ctaElem += '">';

        var ctaInner = '<span class="filler">';
        if (settings.icon) {
            ctaInner += '<span class="icon">' + settings.icon.html + '</span>';
        }// endif
        if (settings.label) {
            ctaInner += '<span class="label">' + settings.label + '</span>';
        }//endif
        ctaInner += '</span>';

        ctaElem += ctaInner;
        ctaElem += '</div>';
        ctaHTML += ctaElem;

    }//endfor

    //console.log('Thats the new cta', ctaHTML);
    ctaHTML += '</' + settings.tag +'>';

    return ctaHTML;

}// get_cta_html()