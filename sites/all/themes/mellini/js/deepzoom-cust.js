/**
 * Manuscript functionalities
 * This script controls behaviors related to the manuscript zoom pages.
 * State-tracking functionality is implemented with cookies that record
 * which views, tooltips, and zoomlevels were last seen. These cookies
 * expire after 1 day by default.
 *
 * James Pan and Paula Carlson
 * J. Paul Getty Web Group
 */

jQuery(function(){

	// var state = JSON.parse(localStorage.getItem('state')) || {
	// 	// bounds1: null,
	// 	// bounds2: null,
	// 	firstPanel: null,
	// 	secondPanel: null,
	// 	// firstTrans: null,
	// 	// secondTrans: null,
	// 	// firstEnglish: null,
	// 	// secondEnglish: null,
	// 	panelView: null,
	// 	valid: null
	// };

	// Reset the viewport's center on resize (eg, switching from one panel to two)
	jQuery(viewer).each(function(ind, obj) {
		obj.addEventListener('resize', function(view) {
			// pan to the viewport's current center, keeping image in view.
			if(view.viewport) view.viewport.panTo(view.viewport.getCenter(true));
		});
		// update state of viewer bounds on animation finish
		obj.addEventListener('animationfinish', function(e) {
			var bounds = e.viewport.getBounds();
			updateLocalStorage('bounds'+e.container.id.slice(-1), bounds, true);
		});
	});

	// add click listeners to the panel buttons. used to keep track of
	// which pane is currently visible in either the left or right panel (sets  a cookie).
	var addPanelButtonListeners = function(element, which) {
		jQuery(element).find('a').click(function(e) {
			updateLocalStorage(which + "Panel", e.currentTarget.hash);
		});
	};

	jQuery('.group-left .horizontal-tabs-list').children().each(function(index, element) {
		addPanelButtonListeners(element, "first");
	});

	jQuery('.group-right .horizontal-tabs-list').children().each(function(index, element) {
		addPanelButtonListeners(element, "second");
	});

	// add a click listener to the Tipped close button. Clears state related to
	// which tooltip is in view.
	var addCloseListener = function() {
		jQuery('.tpd-close-icon').click(function() {
			clearTippedState();
		});
	};

	// Add tooltip listeners, to keep track of which is currently in view.
	var addTipListeners = function(element, which, pane) {
		var selector = which === "first" ? '.inline-tip' : '.inline-tip-right';
		jQuery(element).find(selector).each(function(index, e) {
			var opts = jQuery(e).attr('data-tipped-options');
			jQuery(e).click(function() {

				clearTippedState();
				updateLocalStorage(which + pane, opts, true);

				setTimeout(addCloseListener, 500);
			});
		});
	};

	// Add the tooltip listeners to each tooltip in both the first (f) or second (s) panel,
	// for both the transcription (t) or english (e) panes.
	jQuery('.group-left .horizontal-tabs-panes').children().each(function(index, element) {
		if(jQuery(element).hasClass('group-transcription')) {
			addTipListeners(element, "first", "Trans");	
		}
		if(jQuery(element).hasClass('group-english')) {
			addTipListeners(element, "first", "English");
		}
	});

	jQuery('.group-right .horizontal-tabs-panes').children().each(function(index, element) {
		if(jQuery(element).hasClass('group-transcription')) {
			addTipListeners(element, "second", "Trans");
		}
		if(jQuery(element).hasClass('group-english')) {
			addTipListeners(element, "second", "English");
		}
	});

	// reset a seadragon viewer
	var resetViewer = function(view) {
		view.viewport.goHome(true);
		view.drawer.reset();
	};

	// condition 0 = single panel
	// condition 1 = dual panel
	// set up styling for the panels
	var condition = 0;
	var firstOpen = true;
	
	jQuery(".ds-2col-stacked-fluid .group-left").width("100%");
	jQuery(".ds-2col-stacked-fluid .group-left").css("float", "left");
	jQuery(".ds-2col-stacked-fluid .group-right").hide();
	jQuery(".ds-2col-stacked-fluid .group-right").width("50%");
	jQuery(".ds-2col-stacked-fluid .group-right").css("float", "left");
	jQuery(".group-transcription").width("575px");
	jQuery(".group-english").width("575px");
	jQuery(".group-transcription").css("left", "187px");
	jQuery(".group-english").css("left", "187px");
	jQuery("ul.horizontal-tabs-list").css({"width": "100%", "margin-left": "0", "border-bottom": "1px solid #666666"});
	jQuery("ul.horizontal-tabs-list li.first").css("margin-left", "344px");
	jQuery(".part-2-right").css("margin-right", "10%");

	// click listener on sxs-button (side-by-side view)
	jQuery("#sxs-button").click(function(){
		Tipped.hideAll();
		// The page loads with condition = 0, meaning single pane is shown
		if (condition === 0) {
			// show double panels
			doubleView();

			// change condition to 1 (dual panes shown)
			condition = 1;			
		} else {
			// show single panel
			singleView();

			condition = 0;
		}
	});

	// set styles for dual view (and state)
	var doubleView = function() {
		jQuery(".ds-2col-stacked-fluid .group-left").width("50%");
		jQuery(".ds-2col-stacked-fluid .group-right").show();
		jQuery(".group-transcription").width("auto");
		jQuery(".group-english").width("auto");
		jQuery(".group-transcription").css("left", "0px");
		jQuery(".group-english").css("left", "0px");

		jQuery(".ds-2col-stacked-fluid .group-left").addClass("double");
		jQuery(".ds-2col-stacked-fluid .group-right").addClass("double");
		jQuery("#sxs-button").addClass("doubleBtn");
		jQuery("div.group-right div.field-group-htabs-wrapper div.horizontal-tabs div.horizontal-tabs-panes fieldset#translation.group-transcription div.fieldset-wrapper div.field div.field-items div.field-item div#block-block-28.block div.content p img.font-btn").addClass("font-right");
		jQuery("ul.horizontal-tabs-list").css({"width": "auto", "margin-left": "100px", "border-bottom": "0"});
		jQuery("ul.horizontal-tabs-list li.first").css("margin-left", "0px");
		jQuery(".part-2-right").css("margin-right", "5px");
		jQuery("div#sxs-button").text("View single page");

		updateLocalStorage("panelView", "double");
	};

	// set styles for single view (and state)
	var singleView = function() {
		jQuery(".ds-2col-stacked-fluid .group-left").width("100%");
		jQuery(".ds-2col-stacked-fluid .group-right").hide();
		jQuery(".group-transcription").width("575px");
		jQuery(".group-english").width("575px");
		jQuery(".group-transcription").css("left", "187px");
		jQuery(".group-english").css("left", "187px");			
		jQuery(".ds-2col-stacked-fluid .group-left").removeClass("double");
		jQuery(".ds-2col-stacked-fluid .group-right").removeClass("double");
		jQuery("#sxs-button").removeClass("doubleBtn");
		jQuery("div#sxs-button").text("View side-by-side");
		jQuery("ul.horizontal-tabs-list").css({"width": "100%", "margin-left": "0", "border-bottom": "1px solid #666666"});
		jQuery("ul.horizontal-tabs-list li.first").css("margin-left", "344px");
		jQuery(".part-2-right").css("margin-right", "10%");

		updateLocalStorage("panelView", "single");
	};
	
	var firstGroup = jQuery('.group-left .horizontal-tabs-list');
	var secondGroup = jQuery('.group-right .horizontal-tabs-list');
	var sxs = jQuery('#sxs-button');

	// get state object
	var lsString = localStorage.getItem('state');
	var st = lsString ? JSON.parse(lsString) : null;
	var path = window.location.pathname;

	if(st && st.valid > Date.now()) {
		// function to adjust zoom on a viewer
		var adjustZoom = function(which, bounds) {
			// create seadragon rectangle, and fit the viewport's bounds to the rectangle.
			var b = new Seadragon.Rect(bounds.x, bounds.y, bounds.width, bounds.height);
			viewer[which].viewport.fitBounds(b);
		};
		// adjust first panel pane
		if(st.firstPanel) {
			jQuery(firstGroup).find('a').each(function(index, element) {
				if(jQuery(element).attr('href') === st.firstPanel) {
					jQuery(element).click();
				}
			});
		}
		// adjust second panel pane
		if(st.secondPanel) {
			jQuery(secondGroup).find('a').each(function(index, element) {
				if(jQuery(element).attr('href') === st.secondPanel) {
					jQuery(element).click();
				}
			});
		}
		// adjust single/double view
		if(st.panelView) {
			switch(st.panelView) {
				case "double":
					jQuery(sxs).click();
					break;
				default:
					break;
			}
		}
		// if there are page specific parameters, use them
		if(st[path]) {
			// adjust zoom bounds
			if(st[path].bounds1) {
				if(viewer[0].viewport !== null) {
					adjustZoom(0, st[path].bounds1);
				} else {
					viewer[0].addEventListener('open', function() {
						adjustZoom(0, st[path].bounds1);
					});
				}
			}
			if(st[path].bounds2) {
				if(viewer[1].viewport !== null) {
					adjustZoom(1, st[path].bounds2);
				} else {
					viewer[1].addEventListener('open', function() {
						adjustZoom(1, st[path].bounds2);
					});
				}
			}
			// adjust tooltips
			if(st[path].firstTrans) {
				jQuery('.group-left .horizontal-tabs-panes .group-transcription .inline-tip').each(function(index, element) {
					if(jQuery(element).attr('data-tipped-options') === st[path].firstTrans) {
						jQuery(window).load(function() {
							clearTippedState();
							jQuery(element).click();
						});
					}
				});
			}
			if(st[path].secondTrans) {
				jQuery('.group-right .horizontal-tabs-panes .group-transcription .inline-tip-right').each(function(index, element) {
					if(jQuery(element).attr('data-tipped-options') === st[path].secondTrans) {
						jQuery(window).load(function() {
							clearTippedState();
							jQuery(element).click();
						});
					}
				});
			}
			if(st[path].firstEnglish) {
				jQuery('.group-left .horizontal-tabs-panes .group-english .inline-tip').each(function(index, element) {
					if(jQuery(element).attr('data-tipped-options') === st[path].firstEnglish) {
						jQuery(window).load(function() {
							clearTippedState();
							jQuery(element).click();
						});
					}
				});
			}
			if(st[path].secondEnglish) {
				jQuery('.group-right .horizontal-tabs-panes .group-english .inline-tip-right').each(function(index, element) {
					if(jQuery(element).attr('data-tipped-options') === st[path].secondEnglish) {
						jQuery(window).load(function() {
							clearTippedState();
							jQuery(element).click();
						});
					}
				});
			}
		}
		
	}

});

// return a Date object that is a specified number of days from today.
// This defaults to 1, but can be passed in a number.
function timeLimit(numDays) {
	numDays = typeof numDays === "number" ? numDays : 1;
	var tomorrow = new Date();
	return tomorrow.setDate(tomorrow.getDate() + numDays);
}

// update local storage object
function updateLocalStorage(key, value, pageSpecific) {
	var lsString = localStorage.getItem('state');
	var object = lsString ? JSON.parse(lsString) : {};
	if(pageSpecific) {
		var path = window.location.pathname;
		if(object[path]) {
			object[path][key] = value;	
		} else {
			object[path] = {};
			object[path][key] = value;
		}
	} else {
		object[key] = value;	
	}
	object.valid = timeLimit();
	localStorage.setItem('state', JSON.stringify(object));
}

// clear the tipped state
function clearTippedState() {
	updateLocalStorage("firstTrans", null, true);
	updateLocalStorage("firstEnglish", null, true);
	updateLocalStorage("secondTrans", null, true);
	updateLocalStorage("secondEnglish", null, true);
}

// clear the local storage of our variables
function clearLocalStorage() {
	localStorage.removeItem('state');
}