/*********************************************
	Author: 	James Pan
	Company: 	J. Paul Getty Trust
	Department: Web/Communications
	Description:
		Mellini slideshow functions
*********************************************/

/*********************************************
	Author: James Pan
	Description: Slideshow init
	Summary:
	Set up the slideshows using flexslider.
	The video needs extra calls for playing
	and pausing automatically, implemented
	here in callbacks.
*********************************************/

var myFlex = myFlex || {};

(function(context) {

	vidPlay = function(slider) {
		current = jQuery(slider.slides[slider.currentSlide]);
		vid = current.find('video');
		if(vid.length > 0) {
			vid[0].play();
		}
	};
	vidPause = function(slider) {
		last = jQuery(slider.slides[slider.currentSlide]);
		vid = last.find('video');
		if(vid.length > 0) {
			vid[0].pause();
		}
	};

	var opts = {
		slideshow: false,
		directionNav: true,
		animation: "slide",
		itemWidth: 590,
		prevText: "<div class='nav-circle nav-circle-prev'><p><span class='fa fa-angle-left'></span></p></div>",
		nextText: "<div class='nav-circle nav-circle-next'><p><span class='fa fa-angle-right'></span></p></div>"
	};

	var opts2 = {
		slideshow: false,
		directionNav: true,
		animation: "slide",
		itemWidth: 590,
		prevText: "<div class='nav-circle nav-circle-prev'><p><span class='fa fa-angle-left'></span></p></div>",
		nextText: "<div class='nav-circle nav-circle-next'><p><span class='fa fa-angle-right'></span></p></div>",
		start: vidPlay,
		before: vidPause,
		after: vidPlay
	};

	context.init = function(select, vid) {
		if(vid) {
			return jQuery(select).flexslider(opts2);
		} else {
			return jQuery(select).flexslider(opts);
		}
	};
})(myFlex);

/*********************************************
	Author: 		James Pan
	Description: 	List item mouseovers
	Summary:
	This function ties list items to images,
	where mousing over a list item changes the
	currently visible image.

	It also sets up an automatic cycling on
	page load. Mousing over any visible list
	item will cancel the automatic cycling.
*********************************************/

var myHover = myHover || {};

(function(context) {
	var hoverInterval = {};

	// Set up the function
	function setUpHover(hovercycle) {
		if(jQuery(hovercycle).hasClass('clone')) return;
		var list = jQuery(hovercycle).find('.hovercycle-elems')[0];
		var img = jQuery(hovercycle).find('.hovercycle-img')[0];
		if(jQuery(img).children().length > 0) {
			jQuery(img).children().each(function() {
				jQuery(this).remove();
			});
		}
		setUpImages(list, img);
		jQuery(list).children().each(function(index, elem) {
			var current = this;
			if(index === 0) {
				jQuery(window).load(function() {
					jQuery(current).find('.hovercycle-element').children().each(function() {
						jQuery(this).addClass('active');
					});
				});
			}
			jQuery(current).hover(function() {
				changeImageState(img, index);

				jQuery(current).find('.hovercycle-element').each(function(idx, elem) {
					// console.log(jQuery(elem).children());
					jQuery(elem).children().each(function(idx, el) {
						jQuery(el).addClass('active');
					});
				});

				// jQuery(current).addClass('active');
				jQuery(list).children().each(function() {
					if(this !== current) {
						// jQuery(this).removeClass('active');
						jQuery(this).find('.hovercycle-element').children().each(function(idx, el) {
							jQuery(el).removeClass('active');
						});
					}
				});
				clearInterval(hoverInterval[jQuery(hovercycle).attr('id')]);
			});
		});
		fixArrows();
		rotateHover(hovercycle);
	}

	context.init = function() {
		if(Object.keys(hoverInterval).length > 0) {
			jQuery(Object.keys(hoverInterval)).each(function(idx, el) {
				clearInterval(hoverInterval[el]);
			});
		}
		jQuery(".hovercycle").each(function() {
			setUpHover(this);
		});
	};

	// Change image state
	function changeImageState(img, index) {
		jQuery(img).children().each(function(indexImg, elem) {
			if(indexImg === index) {
				jQuery(elem).find('img').addClass('active');
			} else if(jQuery(elem).find('img').hasClass('active')) {
				jQuery(elem).find('img').removeClass('active');
			}
		});
	}

	// Change item state, returns a closure with
	// the element references to be used by
	// the automatic cycling interval function
	function changeState(elem) {
		function retFunc() {
			var list = jQuery(elem).find('.hovercycle-elems').children();
			var img = jQuery(elem).find('.hovercycle-img');
			var length = list.length;
			var idx;
			for(var i = 0; i < length; i++) {
				// if (jQuery(list[i]).hasClass('active')) idx = i;
				if(jQuery(jQuery(list[i]).find('.hovercycle-element').children()[0]).hasClass('active')) {
					idx = i;
				}
			}
			var next = idx + 1;
			next = next % length;
			// jQuery(list[idx]).removeClass('active');
			// jQuery(list[next]).addClass('active');
			jQuery(list[idx]).find('.hovercycle-element .hover-darken').each(function(i, e) {
				jQuery(e).removeClass('active');
			});
			jQuery(list[next]).find('.hovercycle-element .hover-darken').each(function(i, e) {
				jQuery(e).addClass('active');
			});
			changeImageState(img, next);
		}
		return retFunc;
	}

	// Sets up the automatic cycling on page load
	function rotateHover(elem) {
		if(!jQuery(elem).hasClass('clone')){
			var func = changeState(elem);
			hoverInterval[jQuery(elem).attr('id')] = setInterval(func, 4000);
		}
	}

	// Set up the images for each list item. The
	// image source paths are attached to the li
	// element in a 'data-img' attribute.
	function setUpImages(list, img) {
		jQuery(list).children().each(function(idx, elem) {
			var imgDiv = document.createElement('div');
			var myImage = document.createElement('img');
			myImage.src = jQuery(elem).data('img');
			myImage.className += 'img-' + idx;
			if(idx === 0) myImage.className += " active";
			jQuery(imgDiv).append(myImage);
			jQuery(img).append(imgDiv);
		});
	}
	
	function fixArrows() {
		jQuery(window).load(function() {
			var list = jQuery('.hovercycle .left-part');
			jQuery(list).each(function(index, elem) {
				var height = jQuery(this).height();
				var halfHeight = height / 2.0;
				jQuery(elem).next().css({
					"border-top-width": halfHeight + "px",
					"border-bottom-width": halfHeight + "px"
				});
			});
		});
	}
})(myHover);

var fixHeights = function(context) {
	var max = 0;
	var h2Height = jQuery(context).find('h2').outerHeight(true);
	var pagerHeight = jQuery(context).find('.flex-control-paging').height();
	jQuery(context).find('.slides').children().each(function() {
		if(jQuery(this).height() > max) max = jQuery(this).height();
	});
	var newHeight = max + h2Height + pagerHeight;
	jQuery(context).outerHeight(newHeight);
};

/*********************************************
	Run on window ready
*********************************************/



jQuery(function() {
	// (function($) {
		myFlex.init('#publication-slider');
		myFlex.init('#manuscript-slider', true);
		myHover.init();
		// fixHeights('#publication-slider');
		// fixHeights('#manuscript-slider');
	// }(jQuery));
});