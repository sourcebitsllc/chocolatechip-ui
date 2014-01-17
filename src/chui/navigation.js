(function($) {
  'use strict';

  ////////////////////////////////////
  // Create custom navigationend event
  ////////////////////////////////////
  function triggerNavigationEvent(target) {
    var transition;
    var tansitionDuration;
    if ('transition' in document.body.style) {
      transition = 'transition-duration';
    } else if ('-webkit-transition' in document.body.style){
      transition = '-webkit-transition-duration';
    }

    function determineDurationType (duration) {
      if (/m/.test(duration)) {
        return parseFloat(duration); 
      } else if (/s/.test(duration)) {
        return parseFloat(duration) * 100;
      }
    }

    tansitionDuration = determineDurationType($('article').eq(0).css(transition));
    
    setTimeout(function() {
      $(target).trigger({type: 'navigationend'});
    }, tansitionDuration);
  }

  $.extend({
    ////////////////////////////////////////////////
    // Manage location.hash for client side routing:
    ////////////////////////////////////////////////
    UITrackHashNavigation : function ( url, delimeter ) {
      url = url || true;
      $.UISetHashOnUrl($.UINavigationHistory[$.UINavigationHistory.length-1], delimeter);
    },

    /////////////////////////////////////////////////////
    // Set the hash according to where the user is going:
    /////////////////////////////////////////////////////
    UISetHashOnUrl : function ( url, delimiter ) {
      delimiter = delimiter || '#/';
      var hash;
      if (/^#/.test(url)) {
        hash = delimiter + (url.split('#')[1]);
      } else {
        hash = delimiter + url;
      }
      if ($.isAndroid) {
        if (/#/.test(url)) {
          url = url.split('#')[1];
        }
        if (/\//.test(url)) {
          url = url.split('/')[1];
        }
        window.location.hash = '#/' + url;
      } else {
        window.history.replaceState('Object', 'Title', hash);
      }
    },

    //////////////////////////////////////
    // Navigate Back to Non-linear Article
    //////////////////////////////////////
    UIGoBackToArticle : function ( articleID ) {
      var historyIndex = $.UINavigationHistory.indexOf(articleID);
      var currentArticle = $('article.current');
      var destination = $(articleID);
      var currentToolbar;
      var destinationToolbar;      
      if ($.UINavigationHistory.length === 0) {
        destination = $('article:first-of-type');
        $.UINavigationHistory.push('#' + destination[0].id);
      }
      var prevArticles;
      if ($.UINavigationHistory.length > 1) {
        prevArticles = $.UINavigationHistory.splice(historyIndex+1);
      } else {
        prevArticles = $('article.previous');
      }
      $.publish('chui/navigateBack/leave', currentArticle[0].id);
      $.publish('chui/navigateBack/enter', destination[0].id);
      currentArticle[0].scrollTop = 0;
      destination[0].scrollTop = 0;
      if (prevArticles.length) {
        $.each(prevArticles, function(_, ctx) {
          $(ctx).removeClass('previous').addClass('next');
          $(ctx).prev().removeClass('previous').addClass('next');
        });
      }
      currentToolbar = currentArticle.next().hazClass('toolbar');
      destinationToolbar = destination.next().hazClass('toolbar');
      destination.removeClass('previous next').addClass('current');
      destination.prev().removeClass('previous next').addClass('current');
      destinationToolbar.removeClass('previous next').addClass('current');
      currentArticle.removeClass('current').addClass('next');
      currentArticle.prev().removeClass('current').addClass('next');
      currentToolbar.removeClass('current').addClass('next');
      $('.toolbar.previous').removeClass('previous').addClass('next');
      $.UISetHashOnUrl($.UINavigationHistory[$.UINavigationHistory.length-1]);
      triggerNavigationEvent(destination);
    },

    ////////////////////////////////////
    // Navigate Back to Previous Article
    ////////////////////////////////////
    UIGoBack : function () {
      var histLen = $.UINavigationHistory.length;
      var currentArticle = $('article.current');
      var destination = $($.UINavigationHistory[histLen-2]);
      var currentToolbar;
      var destinationToolbar;
      if (histLen === 0) {
        destination = $('article:first-of-type');
        $.UINavigationHistory.push('#' + destination[0].id);
      }
      $.publish('chui/navigateBack/leave', currentArticle[0].id);
      $.publish('chui/navigateBack/enter', destination[0].id);
      currentArticle[0].scrollTop = 0;
      destination[0].scrollTop = 0;
      currentToolbar = currentArticle.next().hazClass('toolbar');
      destinationToolbar = destination.next().hazClass('toolbar');
      destination.removeClass('previous').addClass('current');
      destination.prev().removeClass('previous').addClass('current');
      destinationToolbar.removeClass('previous').addClass('current');
      currentArticle.removeClass('current').addClass('next');
      currentArticle.prev().removeClass('current').addClass('next');
      currentToolbar.removeClass('current').addClass('next');
      $.UISetHashOnUrl($.UINavigationHistory[histLen-2]);
      if ($.UINavigationHistory.length === 1) return;
      $.UINavigationHistory.pop();
    },

    isNavigating : false,
  
    ///////////////////////////////
    // Navigate to Specific Article
    ///////////////////////////////
    UIGoToArticle : function ( destination ) {
      if ($.isNavigating) return;
      $.isNavigating = true;
      var current = $('article.current');
      var currentNav = current.prev();
      destination = $(destination); 
      var destinationID = '#' + destination[0].id;
      var destinationNav = destination.prev();
      var currentToolbar;
      var destinationToolbar;
      var navigationClass = 'next previous';
      $.publish('chui/navigate/leave', current[0].id);
      $.UINavigationHistory.push(destinationID);
      $.publish('chui/navigate/enter', destination[0].id);
      current[0].scrollTop = 0;
      destination[0].scrollTop = 0;
      currentToolbar = current.next().hazClass('toolbar');
      destinationToolbar = destination.next().hazClass('toolbar');
      current.removeClass('current').addClass('previous');
      currentNav.removeClass('current').addClass('previous');
      currentToolbar.removeClass('current').addClass('previous');
      destination.removeClass(navigationClass).addClass('current');
      destinationNav.removeClass(navigationClass).addClass('current');
      destinationToolbar.removeClass(navigationClass).addClass('current');
    
      $.UISetHashOnUrl(destination[0].id);
      setTimeout(function() {
        $.isNavigating = false;
      }, 500);

      triggerNavigationEvent(destination);

    }
  });

  ///////////////////
  // Init navigation:
  ///////////////////
  $(function() {
    //////////////////////////////////////////
    // Set first value for navigation history:
    //////////////////////////////////////////
    $.extend({
      UINavigationHistory : ["#" + $('article').eq(0).attr('id')]
    });

    ///////////////////////////////////////////////////////////
    // Make sure that navs and articles have navigation states:
    ///////////////////////////////////////////////////////////
    $('nav:not(#global-nav)').each(function(idx, ctx) {
      // Prevent if splitlayout for tablets:
      if ($('body')[0].classList.contains('splitlayout')) return;
      if (idx === 0) {
        ctx.classList.add('current');
      } else { 
        ctx.classList.add('next'); 
      }
    });
  
    $('article').each(function(idx, ctx) {
      // Prevent if splitlayout for tablets:
      if ($('body')[0].classList.contains('splitlayout')) return;
      if ($('body')[0].classList.contains('slide-out-app')) return;
      if (idx === 0) {
        ctx.classList.add('current');
      } else { 
        ctx.classList.add('next'); 
      }
    }); 

      ///////////////////////////
    // Initialize Back Buttons:
    ///////////////////////////
    $('body').on('singletap', 'a.back', function() {
      if (this.classList.contains('back')) {
        $.UIGoBack();
      }
    });
  
    ////////////////////////////////
    // Handle navigation list items:
    ////////////////////////////////
    $('body').on('singletap doubletap', 'li', function() {
      if ($.isNavigating) return;
      if (!this.hasAttribute('data-goto')) return;
      if (!this.getAttribute('data-goto')) return;
      if (!document.getElementById(this.getAttribute('data-goto'))) return;
      if ($(this).parent()[0].classList.contains('deletable')) return;
      var destinationHref = '#' + this.getAttribute('data-goto');
      $(destinationHref).addClass('navigable');
      var destination = $(destinationHref);
      $.UIGoToArticle(destination);
    });

    $('li[data-goto]').each(function(idx, ctx) {
      $(ctx).closest('article').addClass('navigable');
      var navigable =  '#' + ctx.getAttribute('data-goto');
      $(navigable).addClass('navigable');
    });
  
    /////////////////////////////////////
    // Init navigation url hash tracking:
    /////////////////////////////////////
    // If there's more than one article:
    if ($('article').eq(1)[0]) {
      $.UISetHashOnUrl($('article').eq(0)[0].id);
    }

    /////////////////////////////////////////////////////////
    // Stop rubber banding when dragging down on nav:
    /////////////////////////////////////////////////////////
    $('nav').on($.eventStart, function(e) {
      e.preventDefault();
    });
  });
})(window.jQuery);