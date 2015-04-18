/*
    pO\
   6  /\
     /OO\
    /OOOO\
   /OOOOOO\
  (OOOOOOOO)
   \:~==~:/

ChocolateChip-UI
ChUI.js
Copyright 2015 Sourcebits www.sourcebits.com
License: MIT
Version: 3.8.5
*/
window.CHUIJSLIB;
if(window.jQuery) {
  window.CHUIJSLIB = window.jQuery;
} else if (window.$chocolatechipjs) {
  window.CHUIJSLIB = window.$chocolatechipjs;
}
(function($) {

  $.extend({
    ///////////////
    // Create Uuid:
    ///////////////
    UuidBit : 1,

    Uuid : function() {
      this.UuidBit++;
      return Date.now().toString(36) + this.UuidBit;
    },

    ///////////////////////////
    // Concat array of strings:
    ///////////////////////////
    concat : function ( args ) {
      return (args instanceof Array) ? args.join('') : [].slice.apply(arguments).join('');
    },
    ////////////////////////////
    // Version of each that uses
    // regular parameter order:
    ////////////////////////////
    forEach : function ( obj, callback, args ) {
      function isArraylike( obj ) {
        var length = obj.length,
          type = typeof obj;
        if ( type === "function" || obj === window ) {
          return false;
        }
        if ( obj.nodeType === 1 && length ) {
          return true;
        }
        return type === "array" || length === 0 ||
          typeof length === "number" && length > 0 && ( length - 1 ) in obj;
      } 
      var value,
      i = 0,
      length = obj.length,
      isArray = isArraylike( obj );
      if ( args ) {
        if ( isArray ) {
          for ( ; i < length; i++ ) {
            value = callback.apply( obj[ i ], args );
            if ( value === false ) {
              break;
            }
          }
        } else {
          for ( i in obj ) {
            value = callback.apply( obj[ i ], args );
            if ( value === false ) {
              break;
            }
          }
        }
      // A special, fast, case for the most common use of each
      } else {
        if ( isArray ) {
          for ( ; i < length; i++ ) {
            value = callback.call( obj[ i ], obj[ i ], i );
            if ( value === false ) {
              break;
            }
          }
        } else {
          for ( i in obj ) {
            value = callback.call( obj[ i ], obj[ i ], i );
            if ( value === false ) {
              break;
            }
          }
        }
      }
    }
  });

  $.fn.extend({
    
    ///////////////////////////////////
    // forEach method for jQuery to
    // preserve normal parameter order.
    ///////////////////////////////////
    forEach : function( callback, args ) {
      var $this = this;
      return $.forEach( $this, callback, args );
    },

    //////////////////////
    // Return element that 
    // matches selector:
    //////////////////////
    iz : function ( selector ) {
      if (window.jQuery) {
        var ret = $();
        this.forEach(function(ctx) {
          if ($(ctx).is(selector)) {
            ret.push(ctx);
          }
        });
        return ret;

      } else if (window.$chocolatechipjs) {
        return this.is(selector);
      }
    },
    ////////////////////////////////
    // Return array of unique items:
    ////////////////////////////////
    unique : function() {
      var ret = [];
      var sort = this.sort();
      sort.forEach(function(ctx, idx) {
        if (ret.indexOf(ctx) === -1) {
          ret.push(ctx);
        }
      });
      return ret.length ? ret : [];
    },
    //////////////////////////////
    // Return element that doesn't 
    // match selector:
    //////////////////////////////
    iznt : function ( selector ) {
      if (window.jQuery) {
        return this.not(selector);
      } else if (window.$chocolatechipjs) {
        return this.isnt(selector);
      }
    },
 
    ///////////////////////////////////
    // Return element whose descendants 
    // match selector:
    ///////////////////////////////////
    haz : function ( selector ) {
      return this.has(selector);
    },
    ///////////////////////////////////
    // Return element whose descendants 
    // don't match selector:
    ///////////////////////////////////
    haznt : function ( selector ) {
      if (window.jQuery) {
        var ret = $();
        this.forEach(function(ctx) {
          if (!$(ctx).has(selector)[0]) {
            ret.push(ctx);
          }
        });
        return ret;        
      } else if (window.$chocolatechipjs) {
        return this.hasnt(selector);
      }
    },
    //////////////////////////////////////
    // Return element that has class name:
    //////////////////////////////////////
    hazClass : function ( className ) {
      if (window.jQuery) {
        var ret = $();
        this.forEach(function(ctx) {
          if ($(ctx).hasClass(className)) {
            ret.push(ctx);
          }
        });
        return ret;
      } else if(window.$chocolatechipjs) {
        return this.hasClass(className);
      }
    },
    //////////////////////////////
    // Return element that doesn't 
    // have class name:
    //////////////////////////////
    hazntClass : function ( className ) {
      if (window.jQuery) {
        var ret = $();
        this.forEach(function(ctx) {
          if (!$(ctx).hasClass(className)) {
            ret.push(ctx);
          }
        });
        return ret;
      } else if (window.$chocolatechipjs) {
        var ret = [];
        this.forEach(function(ctx) {
          if (ctx.classList.contains(className)) {
            ret.push(ctx);
          }
        });
        return ret;
      }
    },
    /////////////////////////////////////
    // Return element that has attribute:
    /////////////////////////////////////
    hazAttr : function ( property ) {
      if (window.jQuery) {
        var ret = $();
        this.forEach(function(ctx){
          if ($(ctx).attr(property)) {
            ret.push(ctx);
          }
        });
        return ret;
      } else if (window.$chocolatechipjs) {
        var ret = [];

        return ret;
      }
    },
    //////////////////////////
    // Return element that 
    // doesn't have attribute:
    //////////////////////////
    hazntAttr : function ( property ) {
      if (window.jQuery) {
        var ret = $();
        this.forEach(function(ctx){
          if (!$(ctx).attr(property)) {
            ret.push(ctx);
          }
        });
        return ret;
      } else if (window.$chocolatechipjs) {
        var ret = [];
          if (!ctx.hasAttribute(property)){
            ret.push(ctx);
          }
        return ret;        
      }
    }
  });


  $.extend({
    eventStart : null,
    eventEnd : null,
    eventMove : null,
    eventCancel : null,
    // Define min-length for gesture detection:
    gestureLength : 30 
  });

  $(function() {
    //////////////////////////
    // Setup Event Variables:
    //////////////////////////
    // Pointer events for IE10 and WP8:
    if (window.navigator.pointerEnabled) {
      $.eventStart = 'pointerdown';
      $.eventEnd = 'pointerup';
      $.eventMove = 'pointermove';
      $.eventCancel = 'pointercancel';
    // Pointer events for IE10 and WP8:
    } else if (window.navigator.msPointerEnabled) {
      $.eventStart = 'MSPointerDown';
      $.eventEnd = 'MSPointerUp';
      $.eventMove = 'MSPointerMove';
      $.eventCancel = 'MSPointerCancel';
    // Touch events for iOS & Android:
    } else if ('ontouchstart' in window) {
      $.eventStart = 'touchstart';
      $.eventEnd = 'touchend';
      $.eventMove = 'touchmove';
      $.eventCancel = 'touchcancel';
    // Mouse events for desktop:
    } else {
      $.eventStart = 'mousedown';
      $.eventEnd = 'click';
      $.eventMove = 'mousemove';
      $.eventCancel = 'mouseout';
    }
  });


  $.extend({
    isiPhone : /iphone/img.test(navigator.userAgent),
    isiPad : /ipad/img.test(navigator.userAgent),
    isiPod : /ipod/img.test(navigator.userAgent),
    isiOS : /ip(hone|od|ad)/img.test(navigator.userAgent),
    isAndroid : (/android/img.test(navigator.userAgent) && !/trident/img.test(navigator.userAgent)),
    isWebOS : /webos/img.test(navigator.userAgent),
    isBlackberry : /blackberry/img.test(navigator.userAgent),
    isTouchEnabled : ('createTouch' in document),
    isOnline :  navigator.onLine,
    isStandalone : navigator.standalone,
    isiOS6 : navigator.userAgent.match(/OS 6/i),
    isiOS7 : navigator.userAgent.match(/OS 7/i),
    isWin : /trident/img.test(navigator.userAgent),
    isWinPhone : (/trident/img.test(navigator.userAgent) && /mobile/img.test(navigator.userAgent)),
    isIE10 : navigator.userAgent.match(/msie 10/i),
    isIE11 : (navigator.userAgent.match(/windows nt/i) && navigator.userAgent.match(/trident/i)),
    isIEEdge : (navigator.userAgent.match(/windows nt/i) && navigator.userAgent.match(/edge/i)),
    isWebkit : navigator.userAgent.match(/webkit/),
    isMobile : /mobile/img.test(navigator.userAgent),
    isDesktop : !(/mobile/img.test(navigator.userAgent)),
    isSafari : (!/Chrome/img.test(navigator.userAgent) && /Safari/img.test(navigator.userAgent) && !/android/img.test(navigator.userAgent)),
    isChrome : /Chrome/img.test(navigator.userAgent),
    isNativeAndroid : (/android/i.test(navigator.userAgent) && /webkit/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent)),
    isWideScreen : window.innerWidth >= 960 && (window.orientation === 90 || window.orentation === -90),
    isWideScreenPortrait : window.innerWidth >= 960 && (window.orientation !== 90 || window.orientation !== -90)
    });


  
  /////////////////////////////
  // Determine browser version:
  /////////////////////////////
  $.extend({
    browserVersion : function ( ) {
      var n = navigator.appName;
      var ua = navigator.userAgent;
      var temp;
      var m = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
      if (m && (temp = ua.match(/version\/([\.\d]+)/i))!== null) m[2]= temp[1];
      m = m ? [m[1], m[2]]: [n, navigator.appVersion, '-?'];
      return m[1];
    }
  });

  $(function() {
    ////////////////////////////////
    // Added classes for client side
    // os-specific styles:
    ////////////////////////////////
    $.body = $('body');
  
    if ((/android/img.test(navigator.userAgent)) && (/webkit/img.test(navigator.userAgent) ) && (!/Chrome/img.test(navigator.userAgent))) {
      $.body.addClass('isNativeAndroidBrowser');
    }
    if ($.isWin) {
      $.body.addClass('isWindows');
    } else if ($.isiOS) {
      $.body.addClass('isiOS');
    } else if ($.isAndroid) {
      $.body.addClass('isAndroid');
    }
    if ($.isSafari && parseInt($.browserVersion(), 10) === 6) {
      $.body.addClass('isSafari6');
    }
    if ($.isNativeAndroid) {
      $.body.addClass('isNativeAndroidBrowser');
    }
  });


  //////////////////////////////////////////////////////
  // Swipe Gestures for ChocolateChip-UI.
  // Includes mouse gestures for desktop compatibility.
  //////////////////////////////////////////////////////
  var touch = {};
  var touchTimeout;
  var swipeTimeout;
  var tapTimeout;
  var longTapDelay = 750;
  var singleTapDelay = 150;
  if ($.isAndroid) singleTapDelay = 200;
  var longTapTimeout;
  function parentIfText(node) {
    return 'tagName' in node ? node : node.parentNode;
  }
  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >=
    Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down');
  }
  function longTap() {
    longTapTimeout = null;
    if (touch.last) {
      try {
        if (touch && touch.el) {
          touch.el.trigger('longtap');
          touch = {};
        }
      } catch(err) { }
    }
  }
  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout);
    longTapTimeout = null;
  }
  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout);
    if (tapTimeout) clearTimeout(tapTimeout);
    if (swipeTimeout) clearTimeout(swipeTimeout);
    if (longTapTimeout) clearTimeout(longTapTimeout);
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
    touch = {};
  }
  $(function(){
    var now;
    var delta;
    var body = $(document.body);
    var twoTouches = false;
    body.on($.eventStart, function(e) {
      now = Date.now();
      delta = now - (touch.last || now);
      if (e.originalEvent) e = e.originalEvent;
  
      // Handle MSPointer Events:
      if (window.navigator.msPointerEnabled  || window.navigator.pointerEnabled) {
        if (window && window.jQuery && $ === window.jQuery) {
          if (e.originalEvent && !e.originalEvent.isPrimary) return;
        } else {
          if (!e.isPrimary) return;
        }
        e = e.originalEvent ? e.originalEvent : e;
        body.on('MSHoldVisual', function (e) {
          e.preventDefault();
        });
        touch.el = $(parentIfText(e.target));
        touchTimeout && clearTimeout(touchTimeout);
        touch.x1 = e.pageX;
        touch.y1 = e.pageY;
        twoTouches = false;
      } else {
        if ($.eventStart === 'mousedown') {
          touch.el = $(parentIfText(e.target));
          touchTimeout && clearTimeout(touchTimeout);
          touch.x1 = e.pageX;
          touch.y1 = e.pageY;
          twoTouches = false;
        } else {
          // User to detect two or more finger gestures:
          if (e.touches.length === 1) {
            touch.el = $(parentIfText(e.touches[0].target));
            touchTimeout && clearTimeout(touchTimeout);
            touch.x1 = e.touches[0].pageX;
            touch.y1 = e.touches[0].pageY;
            if (e.targetTouches.length === 2) {
              twoTouches = true;
            } else {
              twoTouches = false;
            }
          }
        }
      }
      if (delta > 0 && delta <= 250) {
        touch.isDoubleTap = true;
      }
      touch.last = now;
      longTapTimeout = setTimeout(longTap, longTapDelay);
    });
    body.on($.eventMove, function(e) {
      if (e.originalEvent) e = e.originalEvent;
      if (window.navigator.msPointerEnabled) {
        if (window && window.jQuery && $ === window.jQuery) {
          if (e.originalEvent && !e.originalEvent.isPrimary) return;
        } else {
          if (!e.isPrimary) return;
        }
        e = e.originalEvent ? e.originalEvent : e;
        cancelLongTap();
        touch.x2 = e.pageX;
        touch.y2 = e.pageY;
      } else {
        cancelLongTap();
        if ($.eventMove === 'mousemove') {
          touch.x2 = e.pageX;
          touch.y2 = e.pageY;
        } else {
          // One finger gesture:
          if (e.touches.length === 1) { 
            touch.x2 = e.touches[0].pageX;
            touch.y2 = e.touches[0].pageY;
          }
        }
      }
      if ($.isAndroid) {
        $.gestureLength = 50;
        if (!!touch.el) {
          // Swipe detection:
          if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > $.gestureLength) ||
        (touch.y2 && Math.abs(touch.y1 - touch.y2) > $.gestureLength))  {
            swipeTimeout = setTimeout(function() {
              e.preventDefault();
              if (touch && touch.el) {
                touch.el.trigger('swipe');
                touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
                touch = {};
              }
            }, 0);
          // Normal tap:
          } else if ('last' in touch) {
            // Delay by one tick so we can cancel the 'tap' event if 'scroll' fires:
            tapTimeout = setTimeout(function() {
            // Trigger universal 'tap' with the option to cancelTouch():
            if (touch && touch.el) {
              touch.el.trigger('tap');
            }
            // Trigger double tap immediately:
            if (touch && touch.isDoubleTap) {
              if (touch && touch.el) {
              touch.el.trigger('doubletap');
              touch = {};
              }
            } else {
              // Trigger single tap after singleTapDelay:
              touchTimeout = setTimeout(function(){
              touchTimeout = null;
              if (touch && touch.el) {
                touch.el.trigger('singletap');
                touch = {};
                return false;
              }
              }, singleTapDelay);
            }
            }, 0);
          }
        } else { return; }  
      }
    });
    body.on($.eventEnd, function(e) {
      if (window.navigator.msPointerEnabled) {
        if (window && window.jQuery && $ === window.jQuery) {
          if (e.originalEvent && !e.originalEvent.isPrimary) return;
        } else {
          if (!e.isPrimary) return;
        }
      }
      cancelLongTap();
      if (!!touch.el) {
        // Swipe detection:
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > $.gestureLength) ||
        (touch.y2 && Math.abs(touch.y1 - touch.y2) > $.gestureLength))  {
          swipeTimeout = setTimeout(function() {
            if (touch && touch.el) {
              touch.el.trigger('swipe');
              touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
              touch = {};
            }
          }, 0);
        // Normal tap:
        } else if ('last' in touch) {
          // Delay by one tick so we can cancel the 'tap' event if 'scroll' fires:
          tapTimeout = setTimeout(function() {
            // Trigger universal 'tap' with the option to cancelTouch():
            if (touch && touch.el) {
              touch.el.trigger('tap');
            }
            // Trigger double tap immediately:
            if (touch && touch.isDoubleTap) {
              if (touch && touch.el) {
                touch.el.trigger('doubletap');
                touch = {};
              }
            } else {
              // Trigger single tap after singleTapDelay:
              touchTimeout = setTimeout(function(){
                touchTimeout = null;
                if (touch && touch.el) {
                  touch.el.trigger('singletap');
                  touch = {};
                  return false;
                }
              }, singleTapDelay);
            }
          }, 0);
        }
      } else { return; }
    });
    body.on('touchcancel', cancelAll);
  });
  ['swipe', 'swipeleft', 'swiperight', 'swipeup', 'swipedown', 'doubletap', 'tap', 'singletap', 'longtap'].forEach(function(method){ 
    // Add gesture events to ChocolateChipJS:
    $.fn.extend({
      method : function(callback){ 
        return this.on(method, callback);
      }
    });
  });


  /////////////////////////////////////////
  // Set classes for desktop compatibility:
  /////////////////////////////////////////
  $.extend({
    UIDesktopCompat : function ( ) {
      if ($.isDesktop && $.isSafari) {
        $('body').addClass('isiOS').addClass('isDesktopSafari isDesktop');
      } else if ($.isDesktop && $.isChrome) {
        $('body').addClass('isAndroid').addClass('isDesktopChrome isDesktop');
      }
    }
  });
  $(function() {
    $.UIDesktopCompat();
  });


  $(function() { 
    $.body = $('body');

    //////////////////////
    // Add the global nav:
    //////////////////////
    if (!$.body[0].classList.contains('splitlayout')) {
      $('body').prepend("<nav id='global-nav'></nav>");
    }

    /////////////////////////////////////////////////
    // Fix Split Layout to display properly on phone:
    /////////////////////////////////////////////////
    if ($.body[0].classList.contains('splitlayout')) {
      if (window.innerWidth < 768) {
        $('meta[name=viewport]').attr('content','width=device-width, initial-scale=0.45, maximum-scale=2, user-scalable=yes');
      }
    }

    /////////////////////////////////////////////////////////
    // Add class to nav when button on right.
    // This allows us to adjust the nav h1 for small screens.
    /////////////////////////////////////////////////////////
    $('h1').each(function(idx, ctx) {
      if (ctx.nextElementSibling && ctx.nextElementSibling.nodeName === 'A') {
        ctx.classList.add('buttonOnRight');
      }
    });

    //////////////////////////////////////////
    // Get any toolbars and adjust the bottom 
    // of their corresponding articles:
    //////////////////////////////////////////
    $('.toolbar').prev('article').addClass('has-toolbar');

    if ($.isiOS && $.isStandalone) {
      $.body[0].classList.add('isStandalone');
    }
  });


  /////////////////////////
  // Hide and show navbars:
  /////////////////////////
  $.extend({    
    UIHideNavBar : function () {
      $('nav').hide();
      $.body.addClass('hide-navbars');
    },

    UIShowNavBar : function () {
      $('nav').show();
      $.body.removeClass('hide-navbars');
    }
  });


  $.extend({
    subscriptions : {},

    // Topic: string defining topic: /some/topic
    // Data: a string, number, array or object.
    subscribe : function (topic, callback) {
      if (!$.subscriptions[topic]) {
        $.subscriptions[topic] = [];
      }
      var token = ($.Uuid());
      $.subscriptions[topic].push({
        token: token,
        callback: callback
      });
      return token;
    },

    unsubscribe : function ( token ) {
      setTimeout(function() {
        for (var m in $.subscriptions) {
          if ($.subscriptions[m]) {
              for (var i = 0, len = $.subscriptions[m].length; i < len; i++) {
                  if ($.subscriptions[m][i].token === token) {
                    $.subscriptions[m].splice(i, 1);
                    return token;
                  }
              }
          }
        }
        return false;
      });
    },

    publish : function ( topic, args ) {
      if (!$.subscriptions[topic]) {
        return false;
      }
      setTimeout(function () {
        var len = $.subscriptions[topic] ? $.subscriptions[topic].length : 0;
        while (len--) {
          $.subscriptions[topic][len].callback(topic, args);
        }
        return true;
      });
      return true;
   }
  });


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
    UITrackHashNavigation : function ( url, delimiter ) {
      url = url || true;
      $.UISetHashOnUrl($.UINavigationHistory[$.UINavigationHistory.length-1], delimiter);
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
        $.forEach(prevArticles, function(ctx) {
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
      triggerNavigationEvent(destination);
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
    $('nav:not(#global-nav)').forEach(function(ctx, idx) {
      // Prevent if splitlayout for tablets:
      if ($('body')[0].classList.contains('splitlayout')) return;
      if (idx === 0) {
        ctx.classList.add('current');
      } else { 
        ctx.classList.add('next'); 
      }
    });
  
    $('article').forEach(function(ctx, idx) {
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
    $('body').on('singletap', '.back', function() {
      if (this.classList.contains('back')) {
        $.UIGoBack();
      }
    });
  
    ////////////////////////////////
    // Handle navigation list items:
    ////////////////////////////////
    $('body').on('singletap doubletap', 'li', function() {
      var $this = $(this);
      if ($.isNavigating) return;
      if (!this.hasAttribute('data-goto')) return;
      if (!this.getAttribute('data-goto')) return;
      if (!document.getElementById(this.getAttribute('data-goto'))) return;
      if ($(this).parent()[0].classList.contains('deletable')) return;
      $this.addClass('selected');
      var destinationHref = '#' + this.getAttribute('data-goto');
      $(destinationHref).addClass('navigable');
      setTimeout(function() {
        $this.removeClass('selected');
      }, 1000);
      var destination = $(destinationHref);
      if ($.isAndroid || $.isChrome) {
        setTimeout(function() {
          $.UIGoToArticle(destination);
        }, 200);
      } else {
        $.UIGoToArticle(destination);
      }
    });
    $('li[data-goto]').forEach(function(ctx) {
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


  $.fn.extend({
    /////////////////////////
    // Block Screen with Mask
    /////////////////////////
    UIBlock : function ( opacity ) {
      opacity = opacity ? " style='opacity:" + opacity + "'" : " style='opacity: .5;'";
      $(this).before("<div class='mask'" + opacity + "></div>");
      $('article.current').attr('aria-hidden',true);
      return this;
    },

    //////////////////////////
    // Remove Mask from Screen
    //////////////////////////
    UIUnblock : function ( ) {
      $('.mask').remove();
      $('article.current').removeAttr('aria-hidden');
      return this;
    }
  });


  $.fn.extend({
    //////////////////////////////
    // Center an Element on Screen
    //////////////////////////////
    UICenter : function ( position ) {
      var position = position;
      if (!this[0]) return;
      var $this = $(this);
      var parent = $this.parent();
      if (position) {
        $(this.css('position', position));
      } else if ($this.css('position') === 'absolute') {
        position = 'absolute';
      } else {
        position = 'relative';
      }
      var height, width, parentHeight, parentWidth;
      if (position === 'absolute') {
        height = $this[0].clientHeight;
        width = $this[0].clientWidth;
        parentHeight = parent[0].clientHeight;
        parentWidth = parent[0].clientWidth;
      } else {
        height = parseInt($this.css('height'),10);
        width = parseInt($this.css('width'),10);
        parentHeight = parseInt(parent.css('height'),10);
        parentWidth = parseInt(parent.css('width'),10);
        $(this).css({'margin-left': 'auto', 'margin-right': 'auto'});
      }
      var tmpTop, tmpLeft;
      if (parent[0].nodeName === 'body') {
        tmpTop = ((window.innerHeight /2) + window.pageYOffset) - height /2 + 'px';
        tmpLeft = ((window.innerWidth / 2) - (width / 2) + 'px');
      } else {
        tmpTop = (parentHeight /2) - (height /2) + 'px';
        tmpLeft = (parentWidth / 2) - (width / 2) + 'px';
      }
      if (position !== 'absolute') tmpLeft = 0;
      // if (parseInt(tmpLeft,10) <= 0) tmpLeft = '10px';
      $this.css({left: tmpLeft, top: tmpTop});
    }
  });


  $.fn.extend({
    ////////////////////////
    // Create Busy indicator
    ////////////////////////
    /*
      var options = {
        color: 'red',
        size: '80px',
        position: 'right'
      }
    */
    UIBusy : function ( options ) {
      var count = 1;
      options = options || {};
      var settings = {
        size: 43,
        color: '#000',
        position: false,
        duration: '2s'
      };
      $.extend(settings, options);
      var $this = this;
      var spinner;
      // For iOS:
      var iOSBusy = function() {
        var webkitAnim = {'-webkit-animation-duration': settings.duration};
        spinner = $('<span class="busy"></span>');
        $(spinner).css({'background-color': settings.color, 'height': settings.size + 'px', 'width': settings.size + 'px'});
        $(spinner).css(webkitAnim);
        $(spinner).attr('role','progressbar');
        if (settings.position) $(spinner).addClass(settings.position);
        $this.append(spinner);
        return this;
      };
      // For Android:
      var androidBusy = function() {
        settings.id = $.Uuid();
        var androidActivityIndicator = null;
        var position = settings.position ? (' ' + settings.position) : '';
        if ($.isNativeAndroid) {
          androidActivityIndicator = '<svg class="busy' + position + '" version="1.1" id="' + settings.id + '" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><g><path fill="none" stroke="' + settings.color + '" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M74.2,65c2.7-4.4,4.3-9.5,4.3-15c0-15.7-12.8-28.5-28.5-28.5S21.5,34.3,21.5,50c0,5.5,1.6,10.6,4.3,15"/></g><polyline fill="none" stroke="' + settings.color + '" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="89.4,56.1 74.3,65 65.4,49.9 "/></svg>';

          $this.append(androidActivityIndicator);
          return;
        } else {
          androidActivityIndicator = '<svg id="'+ settings.id +'" class="busy' + position + '" x="0px" y="0px" viewBox="0 0 100 100"><circle stroke="url(#SVGID_1_)" cx="50" cy="50" r="28.5"/></svg>';
          $this.append(androidActivityIndicator);
          $this.addClass('hasActivityIndicator');
          if (settings.position) {
            $('#' + settings.id).addClass(settings.position);
          }
          if (options.color) {
            $('#' + settings.id).find('circle').css('stroke', options.color);
          }
        }
        $('#' + settings.id).css({'height': settings.size + 'px', 'width': settings.size + 'px'});
        return $('#' + settings.id);
      };
      // For Windows 8/WP8:
      var winBusy = function() {
        spinner = $('<progress class="busy"></progress>');
        $(spinner).css({ 'color': settings.color });
        $(spinner).attr('role','progressbar');
        $(spinner).addClass('win-ring');
        if (settings.position) $(spinner).addClass(settings.position);
        $this.append(spinner);
        return this;
      };
      // Create Busy control for appropriate OS:
      if ($.isWin) {
        winBusy(options);
      } else if ($.isAndroid || $.isChrome) {
        androidBusy(options);
      } else if ($.isiOS || $.isSafari) {
        iOSBusy(options);
      }
    }
  });


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


  $.fn.extend({
    ///////////////////////////////
    // Initialize Segmented Control
    ///////////////////////////////
    UISegmented : function ( options ) {
      /*
        var options = {
          selected: 0,
          callback: function() { alert('Boring!'); }
        }
      */
      if ($(this).hazClass('paging').length) return;
      var callback = (options && options.callback) ? options.callback : $.noop;
      var selected = (options && options.selected > 0) ? options.selected : 0;
      this.find('button').forEach(function(ctx, idx) {
        $(ctx).attr('role','radio');
        $(ctx).addClass('segment');
        if (idx === selected) {
          ctx.setAttribute('aria-checked', 'true');
          ctx.classList.add('selected');
        }
      });
      this.on('singletap', 'button', function(e) {
        var $this = $(this);
        if (this.parentNode.classList.contains('paging')) return;
        $this.siblings('button').removeClass('selected');
        $this.siblings('button').removeAttr('aria-checked');
        $this.addClass('selected');
        $this.attr('aria-checked', true);
        callback.call(this, e);
      });
    }
  });
  $.extend({ 
    ///////////////////////////
    // Create Segmented Control
    ///////////////////////////
    UICreateSegmented : function ( options ) {
      /* 
        options = {
          id : '#myId',
          className : 'special' || '',
          labels : ['first','second','third'],
          selected: 0
        }
      */
      var segmented;
      var id = (options && options.id) ? options.id : $.Uuid();
      var className = (options && options.className) ? options.className : '';
      var labels = (options && options.labels) ? options.labels : [];
      var selected = (options && options.selected) ? options.selected : 0;
      var _segmented = ['<div class="segmented'];
      if (className) _segmented.push(' ' + className);
      _segmented.push('">');
      labels.forEach(function(ctx, idx) {
        _segmented.push('<button role="radio" class="segment"');
        _segmented.push('"');
        _segmented.push('>');
        _segmented.push(ctx);
        _segmented.push('</button>');
      });
      _segmented.push('</div>');
      segmented = $(_segmented.join(''));
      segmented.attr('id', id);
      return segmented;
    }
  });


  $.fn.extend({
    ////////////////////////////////////////////
    // Allow Segmented Control to toggle panels
    ////////////////////////////////////////////
    UIPanelToggle : function ( panel, callback ) {
      var panels;
      var selected = 0;
      selected = this.children().hazClass('selected').index() || 0;
      if (panel instanceof Array) {
        panels = panel.children('div');
      } else if (typeof panel === 'string') {
        panels = $(panel).children('div');
      }
      panels.eq(selected).siblings().css({display: 'none'});
      if (callback) callback.apply(this, arguments);
      this.on($.eventEnd, 'button', function() {
        panels.eq($(this).index()).css({display:'block'})
          .siblings().css('display','none');
      });
    
      this.on('singletap', 'button', function() {
        var $this = $(this);
        if (this.parentNode.classList.contains('paging')) return;
        $this.siblings('button').removeClass('selected');
        $this.siblings('button').removeAttr('aria-checked');
        $this.addClass('selected');
        $this.attr('aria-checked', true);
      });
    }
  });


  $.extend({
    ///////////////////////
    // Setup Paging Control
    ///////////////////////
    UIPaging : function ( ) {
      var currentArticle = $('.segmented.paging').closest('nav').next();
      if ($('.segmented.paging').hazClass('horizontal').length) {
        currentArticle.addClass('horizontal');
      } else if ($('.segmented.paging').hazClass('vertical').length) {
        currentArticle.addClass('vertical');
      }
      
      currentArticle.children().eq(0).addClass('current');
      currentArticle.children().eq(0).siblings().addClass('next');
      var sections = function() {
        return currentArticle.children().length;
      };
      var pageBack = function($this) {
        if (sections() === 1) return;
        $this.next().removeClass('selected');
        $this.addClass('selected');
        var currentSection;
        currentSection = $('section.current');
        if (currentSection.index() === 0)  {
          currentSection.removeClass('current');
          currentArticle.children().eq(sections() - 1).addClass('current').removeClass('next');
          currentArticle.children().eq(sections() - 1).siblings().removeClass('next').addClass('previous');
        } else {
          currentSection.removeClass('current').addClass('next');
          currentSection.prev().removeClass('previous').addClass('current');
        }
        setTimeout(function() {
          $this.removeClass('selected');
        }, 250);
      };
      var pageForward = function ($this) {
        if (sections() === 1) return;
        $this.prev().removeClass('selected');
        $this.addClass('selected');
        var currentSection;
        if ($this[0].classList.contains('disabled')) return;
        currentSection = $('section.current');
        if (currentSection.index() === sections() - 1) {
          // start again!
          currentSection.removeClass('current');
          currentArticle.children().eq(0).addClass('current').removeClass('previous');
          currentArticle.children().eq(0).siblings().removeClass('previous').addClass('next');
        } else {
          currentSection.removeClass('current').addClass('previous');
          currentSection.next().removeClass('next').addClass('current');
        }
        setTimeout(function() {
          $this.removeClass('selected');
        }, 250);
      };
      $('.segmented.paging').on($.eventStart, 'button:first-of-type', function() {
        pageBack($(this));
      });
      $('.segmented.paging').on($.eventStart, 'button:last-of-type', function() {
        pageForward($(this));
      });
      // Handle swipe gestures for paging:
      if ($('article.paging.horizontal')[0]) {
        $('article.paging').on('swiperight', function() {
          pageBack($('button:first-of-type'));
        });
        $('article.paging').on('swipeleft', function() {
          pageForward($('button:last-of-type'));
        });
      }
      if ($('article.paging.vertical')[0]) {
        $('article.paging').on('swipeup', function() {
          pageBack($('button:first-of-type'));
        });
        $('article.paging').on('swipeudown', function() {
          pageForward($('button:last-of-type'));
        });
      }
    }
  });


  $.fn.extend({
    
    ////////////////////////////
    // Initialize Editable List,
    // allows moving items and
    // deleting them.
    ////////////////////////////
    UIEditList : function ( options ) {
      /*
        options = {
          editLabel : labelName,
          doneLabel : labelName,
          deleteLabel : labelName,
          callback : callback (Tapping "Done" fires this),
          deletable: false (no deletables),
          movable: false (no movables)
        }
      */
      var settings = {
        editLabel : 'Edit',
        doneLabel : 'Done',
        deleteLabel : 'Delete',
        callback : $.noop,
        deletable: true,
        movable: true
      };
      if (!options) {
        return;
      }
      $.extend(settings, options);

      if (!settings.deletable && !settings.movable) {
        return;
      }

      var transform = ($.isiOS || $.isSafari) ? transform: 'transform';
      var editLabel = settings.editLabel;
      var doneLabel = settings.doneLabel;
      var deleteLabel = settings.deleteLabel;
      var placement = settings.placement;
      var callback = settings.callback;

      var deleteButton;
      var editButton;
      var deletionIndicator;
      var button;
      var dispelDeletable = 'swiperight';
      var enableDeletable = 'swipeleft';
      var moveUpIndicator;
      var moveDownIndicator;
      var dir = $('html').attr('dir');
      dir = dir ? dir.toLowerCase() : '';
      if (dir === 'rtl') {
        dispelDeletable = 'swipeleft';
        enableDeletable = 'swiperight';
      }
      // Windows uses an icon for the delete button:
      if ($.isWin) deleteLabel = '';
      var height = $('li').eq(0)[0].clientHeight;

      if (settings.deletable) {
        deleteButton = $.concat('<button class="delete"><label>', deleteLabel, '</label></button>');
        deletionIndicator = '<span class="deletion-indicator"></span>';
        $(this).addClass('deletable');
      }
      if (settings.movable) {
        var moveUpIndicator = "<span class='move-up'></span>";
        var moveDownIndicator = "<span class='move-down'></span>";
        $(this).addClass('editable');
      }
      editButton = $.concat('<button class="edit">', editLabel, '</button>');
      if (!$(this).closest('article').prev().find('.edit')[0] && !$(this).closest('article').prev().find('.done')[0]) {
        $(this).closest('article').prev().append(editButton);
      }

      button = $(this).closest('article').prev().find('.edit');
      $(this).find('li').forEach(function(ctx) {
        if (!$(ctx).has('.deletion-indicator').length) {
          if (settings.deletable) {
            $(ctx).prepend(deletionIndicator);
          }
          if (settings.movable) {
            $(ctx).append(moveUpIndicator);
            $(ctx).append(moveDownIndicator);
          }
          if (settings.deletable) {
            $(ctx).append(deleteButton);
          }
        }
      });

      // Setup identifiers for list items.
      // These will help determine position & deletion.
      var listItemPosition = [];
      $(this).find('li').forEach(function(ctx, idx) {
        if (idx === 0) {
          $(ctx).attr('data-list-position', '0')
        } else {
          $(ctx).attr('data-list-position', idx)
        }
        listItemPosition.push(idx);
      });
      $(this).attr('data-list-items-position', listItemPosition.join(','));

      // Callback to setup indicator interactions:
      var setupDeletability = function(callback, list, button) {
        $(function() {
          button.on('singletap', function() {
            var $this = this;

            // When button is in "Edit" state:
            if (this.classList.contains('edit')) {
              setTimeout(function() {
                $this.classList.remove('edit');
                $this.classList.add('done');
                $($this).text(settings.doneLabel);
                $(list).addClass('showIndicators');
              });

            // When button is in "Done" state:
            } else if (this.classList.contains('done')) {
              // Execute callback if edit was performed:
              //========================================
              if ($(list).data('list-edit')) {
                callback.call(callback, list);
              }
              setTimeout(function() {
                $this.classList.remove('done');
                $this.classList.add('edit');
                $($this).text(settings.editLabel);
                $(list).removeClass('showIndicators');
                $(list).find('li').removeClass('selected');
              });     
              var movedItems = [];
              $(list).find('li').forEach(function(ctx, idx) {
                movedItems.push($(ctx).attr('data-list-position'));
              });  
              $(list).attr('data-list-items-position', movedItems.join(','));        
            }
          });

          // Handle deletion indicators:
          $(list).off('singletap', '.deletion-indicator');
          $(list).on('singletap', '.deletion-indicator', function() {
            if ($(this).parent('li').hazClass('selected').length) {
              $(this).parent('li').removeClass('selected');
              return;
            } else {
              $(this).parent('li').addClass('selected');
            }
          });
        
          // Handle swipe gestures:
          $(list).on(dispelDeletable, 'li', function() {
            // If no deletables, disable swipes:
            if (!settings.deletable) return;
            // Else reveal delete button:
            $(this).removeClass('selected');
          });
          
          $(list).on(enableDeletable, 'li', function() {
            // If no deletables, disable swipes:
            if (!settings.deletable) return;
            // Else reveal delete button:
            $(this).addClass('selected');
          });

          // Move list item up:
          $(list).on('singletap', '.move-up', function(e) {
            var item = $(this).closest('li');
            if ((window.$chocolatechipjs && item.is('li:first-child')[0]) || window.jQuery && item.is('li:first-child')) {
              return;
            } else {
              // Mark list as edited:
              $(list).data('list-edit', true);
              var item = $(this).closest('li');
              var prev = item.prev();
              // Clone the items to replace the
              // transitioned ones alter:
              var itemClone = item.clone();
              var prevClone = prev.clone();
              var height = item[0].offsetHeight;
              item.css({
                "-webkit-transform": "translate3d(0,-" + height + "px,0)",
                "transform": "translate3d(0,-" + height + "px,0)"
              });

              prev.css({
                "-webkit-transform": "translate3d(0," + height + "px,0)",
                "transform": "translate3d(0," + height + "px,0)"
              });              
              setTimeout(function() {
                if (window.$chocolatechipjs) {
                  $.replace(prevClone, item);
                  $.replace(itemClone, prev);
                } else {
                  item.replaceWith(prevClone)
                  prev.replaceWith(itemClone)
                }
              }, 250);
            }
          });

          // Move list item down:
          $(list).on('singletap', '.move-down', function(e) {
            var item = $(this).closest('li');
            var next = item.next();
            // Clone the items to replace the
            // transitioned ones alter:
            var itemClone = item.clone();
            var nextClone = next.clone();
            if ((window.$chocolatechipjs && item.is('li:last-child')[0]) || window.jQuery && item.is('li:last-child')) {
              return;
            } else {
              // Mark list as edited:
              $(list).data('list-edit', true);

              var height = item[0].offsetHeight;
              item.css({
                '-webkit-transform': 'translate3d(0,' + height + 'px,0)',
                transform: 'translate3d(0,' + height + 'px,0)'
              });
              next.css({
                "-webkit-transform": "translate3d(0,-" + height + "px,0)",
                "transform": "translate3d(0,-" + height + "px,0)"
              });
              setTimeout(function() {
                if (window.$chocolatechipjs) {
                   $.replace(nextClone, item);
                   $.replace(itemClone, next);
                } else {
                  item.replaceWith(nextClone)
                  next.replaceWith(itemClone)
                }
              }, 250);
            }
          });

          // Handle deletion of list item:
          $(list).on('singletap', '.delete', function() {
            var $this = this;
            // Mark list as edited:
            $(list).data('list-edit', true);
            var direction = '-1200%';
            if ($('html').attr('dir') === 'rtl') direction = '1000%';
            $(this).siblings().css({
              '-webkit-transform': 'translate3d(' + direction + ',0,0)', 
              '-webkit-transition': 'all 1s ease-out', 
              'transform': 'translate3d(' + direction + ',0,0)', 
              'transition': 'all 1s ease-out'
            });

            // Handle storing info about deleted items on the list itself:
            var deletedItems = $(list).attr('data-list-items-deleted');
            if (deletedItems === undefined) {
              deletedItems = [$(this).closest('li').attr('data-list-position')];
            } else {
              deletedItems = deletedItems.split(',');
              deletedItems.push($(this).closest('li').attr('data-list-position'));
            }
            $(list).attr('data-list-items-deleted', deletedItems.sort().join(','));

            setTimeout(function() {
              $($this).parent().remove();
            }, 500);
          });
        });    
      };
      // Initialize the editable list:
      return setupDeletability(settings.callback, $(this), button);
    }

  });


  $.fn.extend({
    /////////////////////////
    // Initialize Select List
    /////////////////////////
    /*
    // For default selection use zero-based integer:
    options = {
      name : name // used on radio buttons as group name, defaults to uuid.
      selected : integer,
      callback : callback
      // callback example:
      function () {
        // this is the selected list item:
        console.log($(this).text());
      }
    }
    */
    UISelectList : function (options) {
      var name = (options && options.name) ? options.name : $.Uuid();
      var list = this[0];
      list.classList.add('select');
      $(list).find('li').forEach(function(ctx, idx) {
        var value = ctx.getAttribute("data-select-value") !== null ? ctx.getAttribute("data-select-value") : "";
        ctx.setAttribute('role', 'radio');
        $(ctx).removeClass('selected').find('input').removeAttr('checked');
        if (options && options.selected === idx) {
          ctx.setAttribute('aria-checked', 'true');
          ctx.classList.add('selected');
          if (!$(ctx).find('input')[0]) {
            $(ctx).append('<input type="radio" checked="checked" name="' + name + '" value="' + value +'">');
          } else {
            $(ctx).find('input').prop('checked',true).attr('value', value);
          }
        } else {
          if (!$(ctx).find('input')[0]) {
            $(ctx).append('<input type="radio" name="' + name + '" value="' + value +'">');
          }
        }
      });
      $(list).on('singletap', 'li', function() {
        var item = this;
        $(item).siblings('li').removeClass('selected');
        $(item).siblings('li').removeAttr('aria-checked');
        $(item).siblings('li').find('input').removeAttr('checked');
        $(item).addClass('selected');
        item.setAttribute('aria-checked', true);
        $(item).find('input').prop('checked',true);
        if (options && options.callback) {
          options.callback.apply(this, arguments);
        }
      });
    }
  });


  $.extend({
    ///////////////////////////////////////////////
    // UISheet: Create an Overlay for Buttons, etc.
    ///////////////////////////////////////////////
    /*
      var options {
        id : 'starTrek',
        listClass :'enterprise',
        background: 'transparent',
        handle: false
      }
    */
    UISheet : function ( options ) {
      if (!options) var options = {};
      if (options.background) options.background =  $.concat(' style="background-color:', options.background, '" ');
      if (options.handle === false) options.handle = '';
      var settings = {};
      settings.id = $.Uuid();
      settings.listClass = '';
      settings.background = '';
      settings.handle = '<div class="handle"><span></span></div>';
      if (options) $.extend(settings, options);
      var sheet = $.concat('<div id="', settings.id, '" class="sheet', settings.listClass, '"', settings.background, '>', settings.handle, '<section class="scroller-vertical"></section></div>');
      $('body').append(sheet);
      $('.sheet .handle').on($.eventStart, function() {
        var $this = $(this);
        if ($.isAndroid || $.isChrome) {
          $this.addClass('selected');
          setTimeout(function() {
            $this.removeClass('selected');
            $.UIHideSheet();
          }, 500);
        } else {
          $.UIHideSheet();
        }
      });
    },
    UIShowSheet : function ( id ) {
      var sheet = id ? id : '.sheet';
      $('article.current').addClass('blurred');
      if ($.isAndroid || $.isChrome) {
        $(sheet).css('display','block');
        setTimeout(function() {
          $(sheet).addClass('opened');
        }, 20);
      } else {
        $(sheet).addClass('opened');
      }
    },
    UIHideSheet : function ( ) {
      $('.sheet').removeClass('opened');
      $('article.current').addClass('removeBlurSlow');
      setTimeout(function() {
        $('article').removeClass('blurred');
        $('article').removeClass('removeBlurSlow');
      },500);
    }
  });


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


  $.fn.extend({
    /////////////////
    // Create stepper
    /////////////////
    /*
      var options = {
        start: 0,
        end: 10,
        defaultValue: 3
      }
    */
    UIStepper : function (options) {
      if (!options) return [];
      if (!options.start) return [];
      if (!options.end) return [];
      var stepper = $(this);
      var start = options.start;
      var end = options.end;
      var defaultValue = options.defaultValue ? options.defaultValue : options.start;
      var increaseSymbol = '+';
      var decreaseSymbol = '-';
      if ($.isWin) {
         increaseSymbol = '';
         decreaseSymbol = '';
      }
      var decreaseButton = '<button class="decrease"><span>' + decreaseSymbol + '</span></button>';
      var label = '<label>' + defaultValue + '</label><input type="text" value="' + defaultValue + '">';
      var increaseButton = '<button class="increase"><span>' + increaseSymbol + '</span></button>';
      stepper.append(decreaseButton + label + increaseButton);
      stepper.data('ui-value', {start: start, end: end, defaultValue: defaultValue});
    
      var decreaseStepperValue = function() {
        var currentValue = stepper.find('input').val();
        var value = stepper.data('ui-value');
        var start = value.start;
        var newValue;
        if (currentValue <= start) {
          $(this).addClass('disabled');
        } else {
          newValue = Number(currentValue) - 1;
          stepper.find('button:last-of-type').removeClass('disabled');
          stepper.find('label').text(newValue);
          stepper.find('input')[0].value = newValue;
          if (currentValue === start) {
            $(this).addClass('disabled');
          }
        }
      };
    
      var increaseStepperValue = function() {
        var currentValue = stepper.find('input').val();
        var value = stepper.data('ui-value');
        var end = value.end;
        var newValue;
        if (currentValue >= end) {
          $(this).addClass('disabled');
        } else {
          newValue = Number(currentValue) + 1;
          stepper.find('button:first-of-type').removeClass('disabled');
          stepper.find('label').text(newValue);
          stepper.find('input')[0].value = newValue;
          if (currentValue === end) {
            $(this).addClass('disabled');
          }
        }
      };
      stepper.find('button:first-of-type').on('singletap', function() {
        decreaseStepperValue.call(this, stepper);
      });
      stepper.find('button:last-of-type').on('singletap', function() {
        increaseStepperValue.call(this, stepper);
      });
    }
  });
  $.extend({
    ///////////////////////////////////////////
    // Pass the id of the stepper to reset.
    // It's value will be reset to the default.
    ///////////////////////////////////////////
    // Pass it the id of the stepper:
    UIResetStepper : function ( stepper ) {
      var defaultValue = stepper.data('ui-value').defaultValue;
      stepper.find('label').html(defaultValue);
      stepper.find('input')[0].value = defaultValue;
    }
  });


  $.fn.extend({
    ////////////////////////////
    // Initialize Switch Control
    ////////////////////////////
    UISwitch : function ( ) {
      var hasThumb = false;
      // Abrstract swipe for left-to-right and right-to-left:
      var swipeOn = "swiperight";
      var swipeOff = "swipeleft"
      if (document.documentElement.dir === "rtl") {
        swipeOn = "swipeleft";
        swipeOff = "swiperight";
      }
      this.forEach(function(ctx, idx) {
        ctx.setAttribute('role','checkbox');
        if ($(ctx).data('ui-setup') === true) return;
        if (!ctx.querySelector('input')) {
          ctx.insertAdjacentHTML('afterBegin', '<input type="checkbox">');
        }
        if (ctx.classList.contains('on')) {
          ctx.querySelector('input').setAttribute('checked', 'checked');
        }
        if (ctx.querySelector('em')) hasThumb = true;
        if (!hasThumb) {
          ctx.insertAdjacentHTML('afterBegin', '<em></em>');
        }
        $(ctx).on('singletap', function() {
          var checkbox = ctx.querySelector('input');
          if (ctx.classList.contains('on')) {
            ctx.classList.remove('on');
            ctx.removeAttribute('aria-checked');
            checkbox.removeAttribute('checked');
          } else {
            ctx.classList.add('on');
            checkbox.setAttribute('checked', 'checked');
            ctx.setAttribute('aria-checked', true);
          }
        });
        $(ctx).on(swipeOn, function() {
          var checkbox = ctx.querySelector('input');
          if (ctx.classList.contains('on')) {
            ctx.classList.remove('on');
            ctx.removeAttribute('aria-checked');
            checkbox.removeAttribute('checked');
          }
        });
        $(ctx).on(swipeOff, function() {
          var checkbox = ctx.querySelector('input');
          if (!ctx.classList.contains('on')) {
            ctx.classList.add('on');
            checkbox.setAttribute('checked', 'checked');
            ctx.setAttribute('aria-checked', true);
          }
        });
        $(ctx).data('ui-setup', true);
      });
    }
  });
  $.extend({
    ////////////////////////
    // Create Switch Control
    ////////////////////////
    UICreateSwitch : function ( options ) {
      /* options = {
          id : '#myId',
          name: 'fruit.mango'
          state : 'on' || 'off' //(off is default),
          value : 'Mango' || '',
          checked: 'on' || '',
          style: 'traditional' || '',
          callback : callback
        }
      */
      var settings = {
        id: $.Uuid(),
        name: '',
        value: '',
        state: '',
        checked: '',
        style: ''
      };
      $.extend(settings, options);
      if (settings.state === 'off') settings.state = '';
      var _switch = $.concat('<span class="switch', " ", settings.style, " ", settings.state, 
        '" id="', settings.id, '"><em></em>','<input type="checkbox"',
        settings.name, settings.checked, ' value="', settings.value, '"></span>');
      return $(_switch);
    }
  });
  $(function() {
    //////////////////////////
    // Handle Existing Switches:
    //////////////////////////
    $('.switch').UISwitch();
  });


  document.addEventListener('touchstart', function (e) {
    var parent = e.target,
      i = 0;

    for (i = 0; i < 10; i += 1) {
      if (parent !== null) {
        if (parent.className !== undefined) {
          if (parent.className.match('navigable')) {
            if (parent.scrollTop === 0) {
              parent.scrollTop = 1;
            } else if ((parent.scrollTop + parent.offsetHeight) === parent.scrollHeight) {
              parent.scrollTop = parent.scrollTop - 1;
            }
          }
        }
        parent = parent.parentNode;
      }
    }
  });


  $.extend({
    ///////////////////////////////////////////
    // Creates a Tab Bar for Toggling Articles:
    ///////////////////////////////////////////
    UITabbar : function ( options ) {
      /*
      var options = {
        id: 'mySpecialTabbar',
        tabs: 4,
        labels: ["Refresh", "Add", "Info", "Downloads", "Favorite"],
        icons: ["refresh", "add", "info", "downloads", "favorite"],
        selected: 2
      }
      */
      if (!options) return;
      var settings = {
        id : $.Uuid(),
        selected : 0
      };
      $.extend(settings, options);
      $('body').addClass('hasTabBar');
      if ($.isiOS6) $('body').addClass('isiOS6');
      var tabbar = '<div class="tabbar" id="' + settings.id + '">';
      var icon = ($.isiOS || $.isSafari) ? '<span class="icon"></span>' : '';
      var articles = $('article');
      for (var i = 0; i < settings.tabs; i++) {
        tabbar += '<button class="' + settings.icons[i];
        if (settings.selected === i+1) {
          tabbar += ' selected';
        }
        tabbar += '">' + icon + '<label>' + settings.labels[i] + '</label></button>';
      }
      tabbar += '</div>';
      $('body').append(tabbar);

      //////////////////////////////////////////////////////
      // Add article id as history data attribute to button:
      //////////////////////////////////////////////////////
      $('#' + settings.id).find('button').forEach(function(ctx, idx){
        $(ctx).data('history', ['#' + articles.eq(idx)[0].id]);
      });
      $('nav').removeClass('current').addClass('next');
      $('#global-nav').removeClass('next');
      $('nav').eq(settings.selected).removeClass('next').addClass('current');
      $('article').removeClass('current').addClass('next');
      $('article').eq(settings.selected-1).removeClass('next').addClass('current');

      // Setup events on tabs:
      var tabButtonTap = 'singletap';
      if ($.isAndroid) {
        tabButtonTap = $.eventStart;
      }
      $('.tabbar').on(tabButtonTap, 'button', function() {
        var $this = this;
        var index;
        var id;
        $.publish('chui/navigate/leave', $('article.current')[0].id);

        //////////////////////////////////////////////////
        // Set the data attribute for the current history:
        //////////////////////////////////////////////////

        $this.classList.add('selected');
        $($this).siblings('button').removeClass('selected');
        index = $(this).index();
        $('article.previous').removeClass('previous').addClass('next');
        $('nav.previous').removeClass('previous').addClass('next');

        /////////////////////////////////////////////////////////////////
        // Update the history array with the current tabs stored history:
        /////////////////////////////////////////////////////////////////
        var history = $(this).data('history');

        ///////////////////////////////////////////////
        // If the history array has more than one item, 
        // we know that it is a navigation link.
        ///////////////////////////////////////////////
        if (history.length > 1) {
          $('article.current').removeClass('current').addClass('next');
          $('nav.current').removeClass('current').addClass('next');

          /////////////////////////////////////////////////
          // Set saved state of navigation list to current:
          /////////////////////////////////////////////////
          $(history[history.length-1]).removeClass('next').addClass('current');
          $(history[history.length-1]).prev().removeClass('next').addClass('current');

          ////////////////////////////////////////////////////
          // Set state for earlier screens of navigation list:
          ////////////////////////////////////////////////////
          var prevScreens = history.length-1;
          for (var i = 0; i < prevScreens; i++) {
            $(history[i]).removeClass('next').addClass('previous');
            $(history[i]).prev().removeClass('next').addClass('previous');
          }

        ////////////////////////////////////////////////
        // Otherwise, since the array has only one item, 
        // we are dealing with a single tabbar panel.
        ////////////////////////////////////////////////
        } else {
          $('article.current').removeClass('current').addClass('next');
          $('nav.current').removeClass('current').addClass('next');
          $('article').eq(index).removeClass('next').addClass('current');
          $('nav').eq(index+1).removeClass('next').addClass('current');
        }

        id = $('article').eq(index)[0].id;
        $.publish('chui/navigate/enter', id);

        // Set the chosen tab article's scroll to top:
        //============================================
        $('article').forEach(function(ctx) {
          if (window.jQuery) {
            $(ctx).scrollTop(0);
          } else if (window.$chocolatechipjs) {
            ctx.scrollTop = 0;
          }
        });
        $.UISetHashOnUrl('#'+id);
        $.UINavigationHistory = $(this).data('history');
      });
    }
  });


  $.extend({
  /////////////////////////////
  // Templating:
  /////////////////////////////
    templates : {},
   
    template : function ( tmpl, variable ) {
      var regex;
      variable = variable || 'data';
      regex = /\[\[=([\s\S]+?)\]\]/g;
      var template =  new Function(variable, 
        "var p=[];" + "p.push('" + tmpl
        .replace(/[\r\t\n]/g, " ")
        .split("'").join("\\'")
        .replace(regex,"',$1,'")
        .split('[[').join("');")
        .split(']]').join("p.push('") + "');" +
        "return p.join('');");
      return template;
    }
  });

  // Define repeater.
  // This lets you output a template repeatedly,
  // using an array of data.


  $.template.data = {};
  
  $.template.index = 0;

  $.template.repeater = function( element, tmpl, data) {
    if (!element) {
      var repeaters = $('[data-repeater]');
      $.template.index = 0;
      repeaters.forEach(function(repeater) {
        var template = repeater.innerHTML;
        repeater = $(repeater);
        var d = repeater.attr('data-repeater');
        if (!d || !$.template.data[d]) {
          console.error("No matching data for template. Check your data assignment on $.template.data or the template's data-repeater value.");
          return;
        }
        repeater.empty();
        repeater.removeClass('cloak');
        var t = $.template(template);
        $.template.data[d].forEach(function(item) {
          repeater.append(t(item));
          $.template.index += 1;
        });
        delete $.template.data[d];
      });      
    } else {
      // Exit if data is not repeatable:
      if (!$.isArray(data)) {
        console.error('$.template.repeater() requires data of type Array.');
        return '$.template.repeater() requires data of type Array.';
      } else {
        var template = $.template(tmpl);
        if ($.isArray(data)) {
          data.forEach(function(item) {
            $(element).append(template(item));
          });
        }
      }
    }
  };


  /////////////////////////
  // Create a search input:
  /////////////////////////
  /*
    $.UISearch({
      articleId: '#products',
      id: 'productSearch',
      placeholder: 'Find a product',
      results: 5
    })
  */
  $.extend({
    UISearch : function(options) {
      var article = options && options.articleId || $('article').eq(0);
      var searchID = options && options.id || $.Uuid();
      var placeholder = options && options.placeholder || 'search';
      var results = options && options.results || 1;
      var widget = '<div class="searchBar"><input placeholder="' + placeholder +'" type="search" results="' + results + '" id="'+ searchID + '"></div>';
      $(article).find('section').prepend(widget);
      if ($.isWin) {
        $(article).prev().append(widget);
        $('#' + searchID).parent().append('<span class="searchGlyph">&#xe11A;</span>');
      }
    }
  });


  //////////////////////////////////
  // Initialize a swipeable carousel:
  //////////////////////////////////
  $(function() {
    var UICarousel = (function () {
      var discoverVendorStyle = document.createElement('div').style,
        vendor = (function () {
          var vendors = 't,webkitT'.split(',');
          var l = vendors.length;
          var t;
          for ( var i = 0 ; i < l; i++ ) {
          t = vendors[i] + 'ransform';
            if ( t in discoverVendorStyle ) {
              return vendors[i].substr(0, vendors[i].length - 1);
            }
          }
          return false;
        })();
      var cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '';
      var transform = prefixStyle('transform');
      var transitionDuration = prefixStyle('transitionDuration');
      var hasTouch = 'ontouchstart' in window;
      if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) hasTouch = false;
      var startEvent = $.eventStart;
      var moveEvent = $.eventMove;
      var endEvent = $.eventEnd;
      var cancelEvent = $.eventCancel;
      var transitionEndEvent = (function () {
        if ( vendor === false ) return false;
        var transitionEnd = {
          '': 'transitionend',
          'webkit': 'webkitTransitionEnd'
          };
        return transitionEnd[vendor];
      })();
        
      var UICarousel = function ( options ) {
        if (!options) return;
        var ul, li, className;
        this.carouselContainer = typeof options.target === 'string' ? document.querySelector(options.target) : options.target;
        this.options = {
          panels: options.panels || 3,
          snapThreshold: null,
          loop: options.loop || true
        };
        // Adjustment for RTL carousels:
        if ($.isRTL) {
          options.loop = true;
        }
        // Include user's options:
        for (var i in options) this.options[i] = options[i];
        this.carouselContainer.style.overflow = 'hidden';
        this.carouselContainer.style.position = 'relative';
        this.carouselPanels = [];
        ul = document.createElement('ul');
        ul.className = 'carousel-track';
        ul.style.cssText = 'position:relative;top:0;height:100%;width:100%;' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform:translateZ(0);' + cssVendor + 'transition-timing-function:ease-out';
        this.carouselContainer.appendChild(ul);
        this.track = ul;
        this.refreshSize();
        var whichPanelIndex;
        for (var j = -1; j < 2; j++) {
          li = document.createElement('li');
          li.id = 'carousel-panel-' + (j + 1);
          li.style.cssText = cssVendor + 'transform:translateZ(0);position:absolute;top:0;height:100%;width:100%;left:' + j * 100 + '%';
          whichPanelIndex = j === -1 ? this.options.panels - 1 : j;
          $(li).data('upcomingPanelIndex', whichPanelIndex);
          if (!this.options.loop && j === -1) li.style.visibility = 'hidden';
          this.track.appendChild(li);
          this.carouselPanels.push(li);
        }
        className = this.carouselPanels[1].className;
        this.carouselPanels[1].className = !className ? 'carousel-panel-active' : className + ' carousel-panel-active';
        this.carouselContainer.addEventListener(startEvent, this, false);
        this.carouselContainer.addEventListener(moveEvent, this, false);
        this.carouselContainer.addEventListener(endEvent, this, false);
        this.track.addEventListener(transitionEndEvent, this, false);
        var pagination;
        if (options.pagination) {
          pagination = document.createElement('ul');
          pagination.className = 'pagination';
          for (var k = 0; k < this.options.panels; k++) {
            li = document.createElement('li');
            if (k === 0) {
              li.className = 'selected';
            }
            pagination.appendChild(li);
          }
          if (window.$chocolatechipjs) {
            this.carouselContainer.insertAdjacentElement('afterEnd', pagination);
          } else {
            $(this.carouselContainer).after(pagination);
          }
        }
      };
      UICarousel.prototype = {
        currentPanel: 1,
        x: 0,
        panel: 0,
        customEvents: [],
        
        onSlide: function (fn) {
          this.carouselContainer.addEventListener('carousel-panel-move', fn, false);
          this.customEvents.push(['move', fn]);
        },
        destroy: function () {
          while ( this.customEvents.length ) {
            this.carouselContainer.removeEventListener('carousel-panel-' + this.customEvents[0][0], this.customEvents[0][1], false);
            this.customEvents.shift();
          }
          // Remove event listeners:
          this.carouselContainer.removeEventListener(startEvent, this, false);
          this.carouselContainer.removeEventListener(moveEvent, this, false);
          this.carouselContainer.removeEventListener(endEvent, this, false);
          this.track.removeEventListener(transitionEndEvent, this, false);
        },
        refreshSize: function () {
          this.carouselContainerWidth = this.carouselContainer.clientWidth;
          this.carouselContainerHeight = this.carouselContainer.clientHeight;
          this.panelWidth = this.carouselContainerWidth;
          this.maxX = -this.options.panels * this.panelWidth + this.carouselContainerWidth;
          this.snapThreshold = this.options.snapThreshold === null ?
            Math.round(this.panelWidth * 0.15) :
            /%/.test(this.options.snapThreshold) ?
              Math.round(this.panelWidth * this.options.snapThreshold.replace('%', '') / 100) :
              this.options.snapThreshold;
        },
        
        updatePanelCount: function (n) {
          this.options.panels = n;
          this.maxX = -this.options.panels * this.panelWidth + this.carouselContainerWidth;
        },
        
        goToPanel: function (p) {
          this.carouselPanels[this.currentPanel].className = this.carouselPanels[this.currentPanel].className.replace(/(^|\s)carousel-panel-active(\s|$)/, '');
          p = p < 0 ? 0 : p > this.options.panels-1 ? this.options.panels - 1 : p;
          console.log('p: ' , p);
          this.panel = p;
          this.track.style[transitionDuration] = '0s';
          this.getPosition(-p * this.panelWidth);
          this.currentPanel = (this.panel + 1) - Math.floor((this.panel + 1) / 3) * 3;
          this.carouselPanels[this.currentPanel].className = this.carouselPanels[this.currentPanel].className + ' carousel-panel-active';
          if (this.currentPanel === 0) {
            this.carouselPanels[2].style.left = this.panel * 100 - 100 + '%';
            this.carouselPanels[0].style.left = this.panel * 100 + '%';
            this.carouselPanels[1].style.left = this.panel * 100 + 100 + '%';
            $(this.carouselPanels[2]).data('upcomingPanelIndex', this.panel === 0 ? this.options.panels - 1 : this.panel - 1);
            $(this.carouselPanels[0]).data('upcomingPanelIndex', this.panel);
            $(this.carouselPanels[1]).data('upcomingPanelIndex', this.panel === this.options.panels - 1 ? 0 : this.panel + 1);
          } else if (this.currentPanel === 1) {
            this.carouselPanels[0].style.left = this.panel * 100 - 100 + '%';
            this.carouselPanels[1].style.left = this.panel * 100 + '%';
            this.carouselPanels[2].style.left = this.panel * 100 + 100 + '%';
            $(this.carouselPanels[0]).data('upcomingPanelIndex', this.panel === 0 ? this.options.panels - 1 : this.panel - 1);
            $(this.carouselPanels[1]).data('upcomingPanelIndex', this.panel);
            $(this.carouselPanels[2]).data('upcomingPanelIndex', this.panel === this.options.panels - 1 ? 0 : this.panel + 1);
          } else {
            this.carouselPanels[1].style.left = this.panel * 100 - 100 + '%';
            this.carouselPanels[2].style.left = this.panel * 100 + '%';
            this.carouselPanels[0].style.left = this.panel * 100 + 100 + '%';
            $(this.carouselPanels[1]).data('upcomingPanelIndex', this.panel === 0 ? this.options.panels - 1 : this.panel - 1);
            $(this.carouselPanels[2]).data('upcomingPanelIndex', this.panel);
            $(this.carouselPanels[0]).data('upcomingPanelIndex', this.panel === this.options.panels - 1 ? 0 : this.panel + 1);
          }
          this.slide();
        },
        handleEvent: function (e) {
          switch (e.type) {
            case startEvent:
              this.start(e);
              break;
            case moveEvent:
              this.move(e);
              break;
            case cancelEvent:
            case endEvent:
              this.end(e);
              break;
          }
        },
        getPosition: function (x) {
          this.x = x;
          this.track.style[transform] = 'translate(' + x + 'px,0) translateZ(0)';
        },
        resize: function () {
          this.refreshSize();
          this.track.style[transitionDuration] = '0s';
          this.getPosition(-this.panel * this.panelWidth);
        },
        start: function (e) {
          if (this.initiated) return;
          var point = hasTouch ? e.touches[0] : e;
          this.initiated = true;
          this.moved = false;
          this.thresholdExceeded = false;
          this.startX = point.pageX;
          this.startY = point.pageY;
          this.pointX = point.pageX;
          this.pointY = point.pageY;
          this.stepsX = 0;
          this.stepsY = 0;
          this.directionX = 0;
          this.directionLocked = false;
          this.track.style[transitionDuration] = '0s';
          this.event('touchstart');
        },
        
        move: function (e) {
          if (!this.initiated) return;
          var point = hasTouch ? e.touches[0] : e;
          var deltaX = point.pageX - this.pointX;
          var deltaY = point.pageY - this.pointY;
          var newX = this.x + deltaX;
          var dist = Math.abs(point.pageX - this.startX);
          this.moved = true;
          this.pointX = point.pageX;
          this.pointY = point.pageY;
          this.directionX = deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0;
          this.stepsX += Math.abs(deltaX);
          this.stepsY += Math.abs(deltaY);
          // Use buffer to calculate direction of swipe:
          if (this.stepsX < 10 && this.stepsY < 10) {
            return;
          }
          // If scrolling vertically, cancel:
          if (!this.directionLocked && this.stepsY > this.stepsX) {
            this.initiated = false;
            return;
          }
          e.preventDefault();
          this.directionLocked = true;
          if (!this.options.loop && (newX > 0 || newX < this.maxX)) {
            newX = this.x + (deltaX / 2);
          }
          this.getPosition(newX);
        },
        
        end: function (e) {
          if (!this.initiated) return;
          var point = hasTouch ? e.changedTouches[0] : e;
          var dist = Math.abs(point.pageX - this.startX);
          this.initiated = false;
          if (!this.moved) return;
          if (!this.options.loop && (this.x > 0 || this.x < this.maxX)) {
            dist = 0;
          }
          // Check if exceeded snap threshold:
          if (dist < this.snapThreshold) {
            this.track.style[transitionDuration] = Math.floor(300 * dist / this.snapThreshold) + 'ms';
            this.getPosition(-this.panel * this.panelWidth);
            return;
          }
          this.checkPosition();
        },
        
        checkPosition: function () {
          var panelMove;
          var pageFlipIndex;
          var className;
          this.carouselPanels[this.currentPanel].className = '';
          // Slide the panel:
          if (this.directionX > 0) {
            this.panel = -Math.ceil(this.x / this.panelWidth);
            this.currentPanel = (this.panel + 1) - Math.floor((this.panel + 1) / 3) * 3;
            panelMove = this.currentPanel - 1;
            panelMove = panelMove < 0 ? 2 : panelMove;
            this.carouselPanels[panelMove].style.left = this.panel * 100 - 100 + '%';
            pageFlipIndex = this.panel - 1;
          } else {
            this.panel = -Math.floor(this.x / this.panelWidth);
            this.currentPanel = (this.panel + 1) - Math.floor((this.panel + 1) / 3) * 3;
            panelMove = this.currentPanel + 1;
            panelMove = panelMove > 2 ? 0 : panelMove;
            this.carouselPanels[panelMove].style.left = this.panel * 100 + 100 + '%';
            pageFlipIndex = this.panel + 1;
          }
          // Add active class to current panel:
          className = this.carouselPanels[this.currentPanel].className;
          /(^|\s)carousel-panel-active(\s|$)/.test(className) || (this.carouselPanels[this.currentPanel].className = !className ? 'carousel-panel-active' : className + ' carousel-panel-active');
          className = this.carouselPanels[panelMove].className;
          pageFlipIndex = pageFlipIndex - Math.floor(pageFlipIndex / this.options.panels) * this.options.panels;
          $(this.carouselPanels[panelMove]).data('upcomingPanelIndex', pageFlipIndex);
          // Index to be loaded in the newly moved panel:
          var newX = -this.panel * this.panelWidth;
          this.track.style[transitionDuration] = Math.floor(500 * Math.abs(this.x - newX) / this.panelWidth) + 'ms';
          // Hide the next panel if looping disabled:
          if (!this.options.loop) {
            this.carouselPanels[panelMove].style.visibility = newX === 0 || newX === this.maxX ? 'hidden' : '';
          }
          if (this.x === newX) {
            this.slide();
          } else {
            this.getPosition(newX);
            this.slide();
          }
        },
        
        slide: function () {
          this.event('move');
        },
        event: function (type) {
          var ev = document.createEvent("Event");
          ev.initEvent('carousel-panel-' + type, true, true);
          this.carouselContainer.dispatchEvent(ev);
        }
      };
      function prefixStyle (style) {
        if ( vendor === '' ) return style;
        style = style.charAt(0).toUpperCase() + style.substr(1);
        return vendor + style;
      }
      return UICarousel;
    })();
    /*
      options = {
        target : (container of carousel),
        panels: (array of content for panels),
        loop: true/false
      }
    */
    $.extend({
      UISetupCarousel : function ( options ) {
        // Method to adjust panel content for RTL:
        function reverseList ( array ) {
          var a = array.shift(0);
          array.reverse();
          array.unshift(a);
          return array;
        }
        if (!options) return;
        options.loop = options.loop || false;
        var carousel = new UICarousel({
          target: options.target,
          panels: options.panels.length,
          loop: options.loop,
          pagination: options.pagination
        });
        $(options.target).data('carousel', carousel);
        // Reverse array of data if RTL:
        if ($.isRTL) options.panels = reverseList(options.panels);
        var panel;
        // Load initial data:
        for (var i = 0; i < 3; i++) {
          panel = (i === 0) ? options.panels.length - 1 : i - 1;
          carousel.carouselPanels[i].innerHTML = options.panels[Number(panel)];
        }
        var index = 0;
        var pagination = $(options.target).next('ul.pagination');
        carousel.onSlide(function () {
          for (var i = 0; i < 3; i++) {
            var upcoming = $(carousel.carouselPanels[i]).data('upcomingPanelIndex');
            carousel.carouselPanels[i].innerHTML = options.panels[Number(upcoming)];
          }
          index = $('.carousel-panel-active').data('upcomingPanelIndex');
          pagination.find('li').removeClass('selected');
          // Handle pagination differently if RTL:
          if ($.isRTL) {
            pagination.find('li').removeClass('selected');
            if (index < 1) {
              pagination.find('li').eq(0).addClass('selected');
            } else {
              pagination.find('li').eq(options.panels.length - index).addClass('selected');
            }
          } else {
            pagination.find('li').eq(index).addClass('selected');
          }
        }); 
        $(options.target).on('mousedown', 'img', function() {return false;});
        var width = $(options.target).css('width');
        pagination.css('width', width);
        pagination.on('click', 'li', function() {
          $(this).siblings('li').removeClass('selected');
          $(this).addClass('selected');
          var goto = 0;
          // Handle pagination differently if RTL:
          if ($.isRTL) {
            var reverse = $(this).parent().children('li').length;
            if ($(this).index() === 0) {
              carousel.goToPanel(0);
            } else {
              goto = reverse - $(this).index();
              carousel.goToPanel(goto);
            }
            $(this).siblings('li').removeClass('selected');
            $(this).addClass('selected');
          } else {
            if ($(this).index() === 0) {
              carousel.goToPanel(0);
            } else {
              carousel.goToPanel($(this).index()); 
            }          
          }
        });
      }
    });
  });


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


  // Widget to enable styled select boxes (pickers):
  $.extend({
    UISelectBox: function() {
      var showSelectBox = function (element) {
          var event;
          event = document.createEvent('MouseEvents');
          event.initMouseEvent('mousedown', true, true, window);
          element.dispatchEvent(event);
      };
      if (!$.isDesktop && $.isiOS) {
        $('.select-box-label').forEach(function(ctx) {
          var label = $(ctx);
          var select = label.prev();
          if (!select[0].id) {
            select.attr('id', $.Uuid());
          }
          select.trigger('singletap');
          label.text(select.val());
          label.attr('for', select.attr('id'));
        });
        $('.select-box select').on('change', function() {
          $(this).next().text($(this).val());
        });
      } else if (!$.isDesktop) {
        var showDropdown = function (element) {
            var event;
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('mousedown', true, true, window);
            element.dispatchEvent(event);
        };
        if (!$.isDesktop) {
          $('.select-box-label').forEach(function(ctx) {
            if (!ctx.id) {
              $(ctx).prev().attr('id', $.Uuid());
            }
            var val = $(ctx).siblings('select').val();
            $(ctx).text(val);
          });
          $('.select-box select').on('change', function() {
            var val = $(this).find("option:selected").text();
            var $this = $(this);
            $this.next('label').text($(this).val());
            $this.siblings('label').text(val);
          });
          $('body').on('singletap', '.select-box-label', function() {
            showDropdown($('select')[0]);
          });
        } 
      }
    }
  });
  $(function() {
    $.UISelectBox();
  });


  //////////////////////////////////////////
  // Plugin to setup automatic data binding:
  //////////////////////////////////////////
  $.extend($, {
    UIBindData : function (controller) {
      var controllers;
      // If user provides controller,
      // only bind to that one:
      if (controller) {
        controllers = $('[data-controller=' + controller +']');
      // Otherwise get all controllers:
      } else {
        controllers = $('[data-controller]');
      }
      var broadcasts = [];

      // Define function to create broadcasts:
      //======================================
      var createBroadcaster = function(controller) {
        var broadcast = 'data-binding-' + $(controller).attr('data-controller');
        broadcasts.push(broadcast);
      };

      // Loop controllers, create broadcasts,
      // subscribe models to broadcasts:
      //=====================================
      controllers.forEach(function(ctx, idx) {
        var model = $(ctx).attr('data-controller');
        createBroadcaster(ctx);
        // Subscribe and update elements with data:
        $.subscribe(broadcasts[idx], function(event, value) {
          var element = '[data-model=' + model + ']';
          $(element).text(value);
        });
      });

      // Bind events to controllers to publish broadcasts:
      //==================================================
      $('body').on('input change', '[data-controller]', function(event) {
        var broadcast = 'data-binding-' + $(this).attr('data-controller');
        $.publish(broadcast, $(this).val());
      });
    },

    //////////////////////////////////////
    // Unbind a specific controller/model:
    //////////////////////////////////////
    UIUnBindData : function (controller) {
      delete $.subscriptions['data-binding-' + controller];
    }
  });

})(window.CHUIJSLIB);