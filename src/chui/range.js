(function($) {
  "use strict";
  $.fn.extend({
    UIRange : function () {
      if ($.isWin) return;
      if (this[0].nodeName !== 'INPUT') return;
      var input = $(this);    
      var newPlace;  
      var width = input.width();
      var newPoint = (input.val() - input.attr("min")) / (input.attr("max") - input.attr("min"));
      var offset = -1.3;
      if (newPoint < 0) { 
        newPlace = 0; 
      } else if (newPoint > 1) { 
        newPlace = width; 
      } else { 
        newPlace = width * newPoint + offset; offset -= newPoint; 
      }
      if ($.isAndroid || $.isChrome) input.css({'background-size': Math.round(newPlace) + 'px 3px, 100% 2px'});
      else input.css({'background-size': Math.round(newPlace) + 'px 10px'});         
    }
  });
  $(function() {
    $('input[type=range]').forEach(function(ctx) {
      $(ctx).UIRange();
    });
    $('body').on('input', 'input[type=range]', function() {
      $(this).UIRange();
    });
  });
})(window.$);