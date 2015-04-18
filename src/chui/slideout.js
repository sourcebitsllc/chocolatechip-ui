(function($) {
  "use strict";
  $.extend({
    ////////////////////////////////////////////////
    // Create Slideout with toggle button.
    // Use $.UISlideout.populate to polate slideout.
    // See widget-factor.js for details.
    ////////////////////////////////////////////////
    /* 
    var options = {
      position: position, 
      dynamic: false,
      callback: $.noop
    };
    */
    UISlideout : function ( options ) {
      var position, dynamic, callback = $.noop;
      if (options && options.position)  {
        position = options.position;
      } else {
        position = 'left';
      }
      if (options && options.dynamic) {
        dynamic = options.dynamic;
      } else {
        dynamic = false;
      }
      if (options && options.callback) {
        callback = options.callback;
      }
      var slideoutButton = $("<button class='slide-out-button'></button>");
      var slideOut = '<div class="slide-out"><section></section></div>';
      $('article').removeClass('next');
      $('article').removeClass('current');
      $('article').prev().removeClass('next');
      $('article').prev().removeClass('current');
      $('body').append(slideOut);
      $('body').addClass('slide-out-app');
      $('article:first-of-type').addClass('show');
      $('article:first-of-type').prev().addClass('show');
      $('#global-nav').append(slideoutButton);
      $('.slide-out-button').on($.eventStart, function() {
        $('.slide-out').toggleClass('open');
        $(this).toggleClass('focused');
      });
      if (!dynamic) {
        $('.slide-out').on('singletap', 'li', function() {
          var $this = $(this);
          $this.addClass('selected');
          setTimeout(function() {
            $this.removeClass('selected');
          }, 500);
          var whichArticle = '#' + $(this).attr('data-show-article');
          $.UINavigationHistory[0] = whichArticle;
          $.UISetHashOnUrl(whichArticle);
          $.publish('chui/navigate/leave', $('article.show')[0].id);
          $.publish('chui/navigate/enter', whichArticle);
          if ($.isAndroid || $.isChrome) {
            setTimeout(function() {
            $('.slide-out').removeClass('open');
            $('article').removeClass('show');
            $('article').prev().removeClass('show');
            $(whichArticle).addClass('show');
            $(whichArticle).prev().addClass('show');
            $('.slide-out-button').removeClass('focused');
            }, 400);
          } else {
            $('.slide-out').removeClass('open');
            $('article').removeClass('show');
            $('article').prev().removeClass('show');
            $(whichArticle).addClass('show');
            $(whichArticle).prev().addClass('show');
            $('.slide-out-button').removeClass('focused');
          }
        });
      } else {
        $('.slide-out').on('singletap', 'li', function() {
          if ($.isAndroid || $.isChrome) {
            setTimeout(function() {
              callback(this);
              $('.slide-out-button').removeClass('focused');
            }, 400);
          } else {
            callback(this);
            $('.slide-out-button').removeClass('focused');
          }
        });
      }
    }
  });
  $.extend($.UISlideout, {
    /////////////////////////////////////////////////////////////////
    // Method to populate a slideout with actionable items.
    // The argument is an array of objects consisting of a key/value.
    // The key will be the id of the article to be shown.
    // The value is the title for the list item.
    // [{music:'Music'},{docs:'Documents'},{recipes:'Recipes'}]
    /////////////////////////////////////////////////////////////////  
    populate: function( args ) {
      var slideout = $('.slide-out');
      if (!slideout[0]) return;
      if (!$.isArray(args)) {
        return;
      } else {
        slideout.find('section').append('<ul class="list"></ul>');
        var list = slideout.find('ul');
        args.forEach(function(ctx) {
          for (var key in ctx) {
            if (key === 'header') {
              list.append('<li class="slideout-header"><h2>'+ctx[key]+'</h2></li>');
            } else {
              list.append('<li data-show-article="' + key + '"><h3>' + ctx[key] + '</h3></li>');
            }
          }
        });
      }
    }
  });
})(window.$);