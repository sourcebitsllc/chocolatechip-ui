(function($) {
  "use strict";
  $.extend({    
    /////////////////
    // Create Popover
    /////////////////
    /*
      id: myUniqueID,
      title: 'Great',
      callback: myCallback,
    */
    UIPopover : function ( options ) {
      options = options || {};
      var settings = {
        id: $.Uuid(),
        callback: $.noop,
        title: '',
      };
      $.extend(settings, options);
      if (options && options.content) {
        settings.content = options.content;
      } else {
        settings.content = '';
      }
      var header = '<header><h1>' + settings.title + '</h1></header>';
      var popover = '<div class="popover" id="' + settings.id + '">' + header + '<section></section></div>';
      var popoverID = '#' + settings.id;
      
      // Calculate position of popover relative to the button that opened it:
      var _calcPopPos = function (element) {
        var offset = $(element).offset();
        var left = offset.left;
        var calcLeft;
        var calcTop;
        var popover = $(popoverID);
        var popoverOffset = popover.offset();
        calcLeft = popoverOffset.left;
        calcTop = offset.top + $(element)[0].clientHeight;
        if ((popover.width() + offset.left) > window.innerWidth) {
          popover.css({
            'left': ((window.innerWidth - popover.width())-20) + 'px',
            'top': (calcTop - 30) + 'px'
          });
        } else {
          popover.css({'left': left + 'px', 'top': (calcTop - 30) + 'px'});
        }
      };

      if ($('.mask')[0]) {
        $.UIPopoverClose();
        $('body').UIUnblock();
        return;
      }
      $('body').append(popover);   
      if ($.isAndroid || $.isChrome) {
        setTimeout(function() {
          $(popoverID).addClass('opened'); 
        }, 50);
      } 
      if ($.isWin) {
        $(popoverID).addClass('open');
      }
      $(popoverID).data('triggerEl', settings.trigger);
      $(popoverID).find('section').append(settings.content);
      settings.callback.call(settings.callback, settings.trigger);
      _calcPopPos(settings.trigger);
      $('.popover').UIBlock('.5');
      
    }
  });
  $.extend({
    ///////////////////////////////////////
    // Align the Popover Before Showing it:
    ///////////////////////////////////////
    UIAlignPopover : function () {
      var popover = $('.popover');
      if (!popover.length) return;
      var triggerID = popover.data('triggerEl');
      var offset = $(triggerID).offset();
      var left = offset.left;
      if (($(popover).width() + offset.left) > window.innerWidth) {
        popover.css({
          'left': ((window.innerWidth - $(popover).width())-20) + 'px'
        });
      } else {
        popover.css({'left': left + 'px'});
      }
    }
  });
  $.extend({
    UIPopoverClose : function ( ) {
      $('body').UIUnblock();
      $('.popover').css('visibility','hidden');
      setTimeout(function() {
        $('.popover').remove();
      },10);
    }
  });
  $(function() {
    /////////////////////////////////////////////////
    // Reposition popovers on window resize:
    /////////////////////////////////////////////////
    $(window).on('resize', function() {
      $.UIAlignPopover();
    });
    var events = $.eventStart + ' singletap ' + $.eventEnd;
    $('body').on(events, '.mask', function(e) {
      if (!$('.popover')[0]) {
        if (e && e.nodeType === 1) return;
        e.stopPropogation();
      } else {
        $.UIPopoverClose();
      }
    });
  });
})(window.$);