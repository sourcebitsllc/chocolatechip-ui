(function($) {
  'use strict';

  //////////////////////////////////
  // Flag if native Android browser:
  //////////////////////////////////
  if ((/android/img.test(navigator.userAgent)) && (/webkit/img.test(navigator.userAgent) ) && (!/Chrome/img.test(navigator.userAgent))) {
    document.body.classList.add('isNativeAndroidBrowser');
  }

  'use strict';
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
})(window.jQuery);