(function($) {
  "use strict";
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
})(window.$);