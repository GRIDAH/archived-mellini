var viewer = new Array();
(function($) {
  Drupal.behaviors.deepzoom = {
    attach: function(context) {
    	
    	var count = 1;
    	$('.deepzoom').each(function() {
    		var i = $(this).attr('id');
    		i = i + '-' + count;
    		$(this).attr('id', i);
    		count = count + 1;
    	});
    	count = 1;
      $('.deepzoom').each(function() {
        id = $(this).attr('id').split('-');
        // Seadragon.Utils.addEvent(window, 'load', function() {
        //   viewer = new Seadragon.Viewer('deepzoom-' + id[1]);
        //   viewer.openDzi(Drupal.settings.deepzoom + '/' + id[1] + '.dzi');
        //   console.log(id[1]);
        // });

      	  v = new Seadragon.Viewer('deepzoom-' + id[1] + '-' + count);
          v.openDzi(Drupal.settings.deepzoom + '/' + id[1] + '.dzi');
          viewer.push(v);
          count = count + 1;
      });
    }
  }
})(jQuery);