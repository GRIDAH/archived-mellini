var zoomViewerHeight;
var zoomViewerWidth;
jQuery(function() {
	jQuery("#flipbook").turn({
	  autoCenter: true,
	  width: 894,
	  height: 600,
	  elevation: 50,

	});

	jQuery("#zoom-viewport").zoom({
	  flipbook: jQuery("#flipbook"),
	  // max: 2,
	  when: {
	  	zoomIn: function() {
	  		resizeViewport();
	  	},
	  	zoomOut: function() {
	  		resizeViewport();
	  	},
	  	change: function() {

	  	}
	  }
	});

	jQuery("#zoom-viewport").css("margin-top", "75px");

	jQuery('#zoom-viewport').bind('zoom.tap', zoomTo);

	jQuery(window).resize(function() {
        resizeViewport();
    }).bind('orientationchange', function() {
        resizeViewport();
    });
});

function zoomTo(event) {
    setTimeout(function() {
        if (jQuery('#zoom-viewport').data().regionClicked) {
            jQuery('#zoom-viewport').data().regionClicked = false;
        } else {
            if (jQuery('#zoom-viewport').zoom('value')==1) {
                jQuery('#zoom-viewport').zoom('zoomIn', event);
            } else {
                jQuery('#zoom-viewport').zoom('zoomOut');
            }
        }
    }, 1);
}

function resizeViewport() {
    var width, height, options;
    width = jQuery(window).width() - 50;
    height = jQuery('#zoom-viewport').height();
    options = jQuery('#flipbook').turn('options');

    jQuery('#zoom-viewport').css({
        width: width,
        height: height
    }).zoom('resize');
}