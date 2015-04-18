(function($) {
  "use strict";
  $.extend({
    ///////////////
    // Create Popup
    ///////////////
    UIPopup : function( options ) {
      /*
      options {
        id: 'alertID',
        title: 'Alert',
        message: 'This is a message from me to you.',
        cancelButton: 'Cancel',
        continueButton: 'Go Ahead',
        callback: function() { // do nothing },
        empty: true
      }
      */
      if (!options) return;
      var settings = {};
      settings.id = $.Uuid();
      settings.content = true;
      $.extend(settings, options);

      var id = settings.id;
      var title = settings.title ? '<header><h1>' + settings.title + '</h1></header>' : '';
      var message = settings.message ? '<p role="note">' + options.message + '</p>' : '';
      var cancelButton = options.cancelButton ? '<button class="cancel" role="button">' + settings.cancelButton + '</button>' : '';
      var continueButton = settings.continueButton  ? '<button class="continue" role="button">' + settings.continueButton + '</button>' : '';
      var callback = settings.callback || $.noop;
      var panelOpen, panelClose, popup;
      if (settings.empty) {
        popup = $.concat('<div class="popup closed" role="alertdialog" id="', id, '"><div class="panel"></div></div>');
      } else {
        popup = $.concat('<div class="popup closed', '" role="alertdialog" id="', id, '"><div class="panel">', title, message, '</div><footer>', cancelButton, continueButton, '</footer>', panelClose, '</div>');
      }
    
      $('body').append(popup);
      if (callback && continueButton) {
        $('.popup').find('.continue').on($.eventStart, function() {
          var $this = $(this);
          if ($.isAndroid || $.isChrome) {
            $this.addClass('selected');
            setTimeout(function() {
              $this.removeClass('selected');
              $('.popup').UIPopupClose();
              callback.call(callback);
            }, 300);
          } else {
            $('.popup').UIPopupClose();
            callback.call(callback);
          }
        });
      }
    
      $.UICenterPopup();
      setTimeout(function() {
      	$('body').find('.popup').addClass('opened');
        $('body').find('.popup').removeClass('closed');
      }, 200);
      $('body').find('.popup').UIBlock('0.5');
      var events = $.eventStart + ' singletap ' + $.eventEnd;
      $('.mask').on(events, function(e) {
        e.stopPropagation();
      });
    },
    
    //////////////////////////////////////////
    // Center Popups When Orientation Changes:
    //////////////////////////////////////////
    UICenterPopup : function ( ) {
      var popup = $('.popup');
      if (!popup[0]) return;
      var tmpTop = ((window.innerHeight /2) + window.pageYOffset) - (popup[0].clientHeight /2) + 'px';
      var tmpLeft;
      if (window.innerWidth === 320) {
        tmpLeft = '10px';
      } else {
        tmpLeft = Math.floor((window.innerWidth - 318) /2) + 'px';
      }
      if ($.isWin) {
        popup.css({top: tmpTop}); 
      } else {
          popup.css({left: tmpLeft, top: tmpTop}); 
        }
    }
  });
  $.fn.extend({
    //////////////
    // Close Popup
    //////////////
    UIPopupClose : function ( ) {
      if (!this && !this.classList.contains('popup')) return;
      $(this).UIUnblock();
      $(this).remove();
    }
  });
  $(function() {
    //////////////////////////
    // Handle Closing Popups:
    //////////////////////////
    $('body').on($.eventStart, '.cancel', function() {
      var $this = $(this);
      if ($this.closest('.popup')[0]) {
        if ($.isAndroid || $.isChrome) {
          $this.addClass('selected');
          setTimeout(function() {
            $this.closest('.popup').UIPopupClose();
            $this.removeClass('selected');
          }, 300);
        } else {
          $this.closest('.popup').UIPopupClose();
        }
      }
    });
    /////////////////////////////////////////////////
    // Reposition popups on window resize:
    /////////////////////////////////////////////////
    $(window).on('resize', function() {
      $.UICenterPopup();
    });
  });
})(window.$);