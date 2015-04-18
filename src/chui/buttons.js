(function($) {
  "use strict";
  $(function() {
    ///////////////////////////////////
    // Initialize singletap on buttons:
    ///////////////////////////////////
    $('body').on('singletap', 'button', function() {
      var $this = $(this);
      if ($this.parent('.segmented')[0] || $this.parent('.tabbar')[0]) return;
      if (this.classList.contains('slide-out-button') || this.classList.contains('back') || this.classList.contains('backTo')) return;
      $this.addClass('selected');
      setTimeout(function() {
        $this.removeClass('selected');
      }, 1000);
    });
  });
})(window.$);