   $.extend($, {
      ////////////////////////
      // Create Switch Control
      ////////////////////////
      UICreateSwitch : function ( options ) {
         /* options = {
               id : '#myId',
               name: 'fruit.mango'
               state : 'on' || 'off' //(off is default),
               value : 'Mango' || '',
               callback : callback
            }
         */
         var id = options ? options.id : $.Uuid();
         var name = options && options.name ? (' name="' + options.name + '"') : '';
         var value= options && options.value ? (' value="' + options.value + '"') : '';
         var state = (options && options.state === 'on') ? (' ' + options.state) : '';
         var checked = (options && options.state === 'on') ? ' checked="checked"' : '';
         var _switch = $.concat('<span class="switch', state, 
            '" id="', id, '"><em></em>','<input type="checkbox"',
            name, checked, value, '></span>');
         return $.make(_switch);
      },
      
      ///////////////////////////
      // Create Segmented Control
      ///////////////////////////
      UICreateSegmented : function ( options ) {
         /* 
            options = {
               id : '#myId',
               className : 'special' || '',
               labels : ['first','second','third'],
               selected : 0 based number of selected button
            }
         */
         var className = (options && options.className) ? options.className : '';
         var labels = (options && options.labels) ? options.labels : [];
         var selected = (options && options.selected) ? options.selected : 0;
         var _segmented = ['<div class="segmented'];
         if (className) _segmented.push(' ' + className);
         _segmented.push('">');
         labels.forEach(function(ctx, idx) {
            _segmented.push('<a role="radio" class="button');
            if (selected === idx) {
               _segmented.push(' selected" aria-checked="true"');
            } else {
               _segmented.push('"');
            }
            _segmented.push('>');
            _segmented.push(ctx);
            _segmented.push('</a>');
         });
         _segmented.push('</div>');
         return _segmented.join('');
      },
      
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
            callback: function() { // do nothing }
         }
         */
         if (!options) return;
         var id = options.id || $.Uuid();
         var title = options.title ? '<header><h1>' + options.title + '</h1></header>' : '';
         var message = options.message ? '<p role="note">' + options.message + '</p>' : '';
         var cancelButton = options.cancelButton ? '<a href="javascript:void(null)" class="button cancel" role="button">' + options.cancelButton + '</a>' : '';
         var continueButton = options.continueButton  ? '<a href="javascript:void(null)" class="button continue" role="button">' + options.continueButton + '</a>' : '';
         var callback = options.callback || $.noop;
         var padding = options.empty ? ' style="padding: 40px 0;" ' : '';
         var panelOpen, panelClose;
         if (options.empty) {
            panelOpen = '';
            panelClose = '';
         } else {
            panelOpen = '<div class="panel">';
            panelClose = '</div>';
         }
         var popup = '<div class="popup closed" role="alertdialog" id="' + id + '"' + padding + '>' + panelOpen + title + message + '<footer>' + cancelButton + continueButton + '</footer>' + panelClose + '</div>';
         
         $.body.append(popup);
         if (callback && continueButton) {
            $('.popup').find('.continue').on($.eventStart, function() {
               $('.popup').UIPopupClose();
               callback.call(callback);
            });
         }
         
         $.UICenterPopup();
         setTimeout(function() {
            $.body.find('.popup').removeClass('closed');
         }, 200);
         $.body.find('.popup').UIBlock('0.5');
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
      },
      
      ///////////////////////////////////////
      // Align the Popover Before Showing it:
      ///////////////////////////////////////
      UIAlignPopover : function () {
         var popover = $('.popover');
         if (!popover.length) return;
         var triggerID = popover.data('triggerEl');
         var offset = $('#'+triggerID).offset();
         var left = offset.left;
         if (($(popover).width() + offset.left) > window.innerWidth) {
            popover.css({
               'left': ((window.innerWidth - $(popover).width())-20) + 'px'
            });
         } else {
            popover.css({'left': left + 'px'});
         }
      },
      
      UIPopoverClose : function ( ) {
         $.body.UIUnblock();
         $('.popover').css('visibility','hidden');
         setTimeout(function() {
            $('.popover').remove();
         },10);
      },
   
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
         $.body.addClass('hasTabBar');
         if ($.isiOS6) $.body.addClass('isiOS6');
         var id = options.id || $.Uuid();
         var selected = options.selected || '';
         var tabbar = '<div class="tabbar" id="' + id + '">';
         var icon = ($.isiOS || $.isSafari) ? '<span class="icon"></span>' : '';
         for (var i = 0; i < options.tabs; i++) {
            tabbar += '<a class="button ' + options.icons[i];
            if (selected === i+1) {
               tabbar += ' selected';
            }
            tabbar += '">' + icon + '<label>' + options.labels[i] + '</label></a>';
         }
         tabbar += '</div>';
         $.body.append(tabbar);
         $('nav').removeClass('current').addClass('next');
         $('nav').eq(selected).removeClass('next').addClass('current');
         $('article').removeClass('current').addClass('next');
         $('article').eq(selected-1).removeClass('next').addClass('current');
         $.body.find('.tabbar').on('singletap', '.button', function() {
            var $this = this;
            var index;
            var id;
            $.publish('chui/navigate/leave', $('article.current')[0].id);
            $this.classList.add('selected');
            $(this).siblings('a').removeClass('selected');
            index = $(this).index();
            $('article.previous').removeClass('previous').addClass('next');
            $('nav.previous').removeClass('previous').addClass('next');
            $('article.current').removeClass('current').addClass('next');
            $('nav.current').removeClass('current').addClass('next');
            id = $('article').eq(index)[0].id;
            $.publish('chui/navigate/enter', id);
            if (window && window.jQuery) {
               $('article').each(function(idx, ctx) {
                  $(ctx).scrollTop(0);
               });
            } else {
               $('article').eq(index).siblings('article').forEach(function(ctx) {
                  ctx.scrollTop = 0;
               });
            }
            
            $.UISetHashOnUrl('#'+id);
            if ($.UINavigationHistory[0] === ('#' + id)) {
               $.UINavigationHistory = [$.UINavigationHistory[0]];
            } else if ($.UINavigationHistory.length === 1) {
               if ($.UINavigationHistory[0] !== ('#' + id)) {
                  $.UINavigationHistory.push('#'+id);
               }
            } else if($.UINavigationHistory.length === 3) {
               $.UINavigationHistory.pop();
            } else {
               $.UINavigationHistory[1] = '#'+id;
            }
            $('article').eq(index).removeClass('next').addClass('current');
            $('nav').eq(index+1).removeClass('next').addClass('current');
         });
      },
      
      ///////////////////////////////////////////////
      // UISheet: Create an Overlay for Buttons, etc.
      ///////////////////////////////////////////////
      /*
         var options {
            id : 'starTrek',
            listClass :'enterprise',
            background: 'transparent',
         }
      */
      UISheet : function ( options ) {
         var id = $.Uuid();
         var listClass = '';
         var background = '';
         if (options) {
            id = options.id ? options.id : id;
            listClass = options.listClass ? ' ' + options.listClass : '';
            background = ' style="background-color:' + options.background + ';" ' || '';
         }
         var sheet = '<div id="' + id + '" class="sheet' + listClass + '"><div class="handle"></div><section class="scroller-vertical"></section></div>';
         $.body.append(sheet);
         $('.sheet .handle').on($.eventStart, function() {
            $.UIHideSheet();
         });
      },
      
      UIShowSheet : function ( ) {
         $('article.current').addClass('blurred');
         if ($.isAndroid || $.isChrome) {
            $('.sheet').css('display','block');
           setTimeout(function() {
               $('.sheet').addClass('opened');
            }, 20);
         } else {
            $('.sheet').addClass('opened');
         }
      },
      
      UIHideSheet : function ( ) {
         $('.sheet').removeClass('opened');
         $('article.current').addClass('removeBlurSlow'); 
         setTimeout(function() {
            $('article').removeClass('blurred');
            $('article').removeClass('removeBlurSlow'); 
         },500);   
      },
      
      UIDesktopCompat : function ( ) {
         if ($.isDesktop && $.isSafari) {
            $.body.addClass('isiOS').addClass('isDesktopSafari');
         } else if ($.isDesktop && $.isChrome) {
            $.body.addClass('isAndroid').addClass('isDesktopChrome');
         }
      }
      
   });

   /////////////////////////////////////////////////////////////////
   // Method to populate a slideout with actionable items.
   // The argument is an array of objects consisting of a key/value.
   // The key will be the id of the article to be shown.
   // The value is the title for the list item.
   // [{music:'Music'},{docs:'Documents'},{recipes:'Recipes'}]
   /////////////////////////////////////////////////////////////////
   $.extend($.UISlideout, {
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
