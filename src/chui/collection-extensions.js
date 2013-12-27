   $.fn.extend({
   
      ////////////////////////////
      // Initialize Switch Control
      ////////////////////////////
      UISwitch : function ( ) {
         var hasThumb = false;
         this.each(function(ctx, idx) {
            if (window && window.jQuery && $ === window.jQuery) ctx = idx;
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
            $(ctx).on('swipeleft', function() {
               var checkbox = ctx.querySelector('input');
               if (ctx.classList.contains('on')) {
                  ctx.classList.remove('on');
                  ctx.removeAttribute('aria-checked');
                  checkbox.removeAttribute('checked');
               }
            });
            $(ctx).on('swiperight', function() {
               var checkbox = ctx.querySelector('input');
               if (!ctx.classList.contains('on')) {
                  ctx.classList.add('on');
                  checkbox.setAttribute('checked', 'checked');
                  ctx.setAttribute('aria-checked', true);
               }
            });
            $(ctx).data('ui-setup', true);
         });
      },
      
      ///////////////////////////////
      // Initialize Segmented Control
      ///////////////////////////////
      UISegmented : function ( options ) {
         if (window && window.jQuery && $ === window.jQuery) {
             if (this.hasClass('paging')) return;
         } else {
            if (this.hasClass('paging')[0]) return;
         }
         var callback = (options && options.callback) ? options.callback : $.noop;
         var selected;
         if (options && options.selected) selected = options.selected;
         if (options && options.callback) {
            callback = options.callback;
         }
         this.find('a').each(function(ctx, idx) {
            if (window && window.jQuery && $ === window.jQuery) ctx = idx;
            $(ctx).find('a').attr('role','radio');
            if (selected === 0 && idx === 0) {
               ctx.setAttribute('aria-checked', 'true');
               ctx.classList.add('selected');
            }
            if (idx === selected) {
               ctx.setAttribute('aria-checked', 'true');
               ctx.classList.add('selected');
            }
         });
         if (!selected) {
            if (!this.find('.selected')[0]) {
               this.children().eq(0).addClass('selected');
            }  
         }
         this.on('singletap', '.button', function(e) {
            e.stopPropagation();
            var $this = $(this);
            if (this.parentNode.classList.contains('paging')) return;
            $this.siblings('a').removeClass('selected');
            $this.siblings('a').removeAttr('aria-checked');
            $this.addClass('selected');
            $this.attr('aria-checked', true);
            callback.call(this, e);
         });
      },
      
      ////////////////////////////////////////////
      // Allow Segmented Control to toggle panels
      ////////////////////////////////////////////
      UIPanelToggle : function ( panel, callback ) {
         var panels;
         var selected = 0;
         if (window && window.jQuery && $ === window.jQuery) {
            if ($(this).children().hasClass('selected')) {
               this.children().each(function(idx, ctx) {
                  if ($(ctx).hasClass('selected')) {
                     selected = idx;
                  }
               });
            }
         } else {
            if (this.children().hasClass('selected')[0]) {
               selected = this.children().hasClass('selected').index();
            }
         }

         if (panel instanceof Array) {
            panels = panel.children('div');
         } else if (typeof panel === 'string') {
            panels = $(panel).children('div');
         }
         panels.eq(selected).siblings().css({display: 'none'});
         if (callback) callback.apply(this, arguments);
         this.on($.eventEnd, 'a', function() {
            panels.eq($(this).index()).css({display:'block'})
               .siblings().css('display','none');
         });
         
         this.on('singletap', '.button', function() {
            var $this = $(this);
            if (this.parentNode.classList.contains('paging')) return;
            $this.siblings('a').removeClass('selected');
            $this.siblings('a').removeAttr('aria-checked');
            $this.addClass('selected');
            $this.attr('aria-checked', true);
         });
      },
       
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
         if (window && window.jQuery && $ === window.jQuery) {
            if (list && !$(list).hasClass('select')) {
               this.addClass('select');
            }
         } else {
            if (list && !$(list).hasClass('select')[0]) {
               this.addClass('select');
            }                  
         }
         if (!list) return [];
         list.classList.add('select');
         $(list).find('li').each(function(ctx, idx) {
            var temp;
            if (window && window.jQuery && $ === window.jQuery) {
               temp = ctx;
               ctx = idx;
               idx = temp;
            }
            ctx.setAttribute('role', 'radio');
            if (options && options.selected === idx) {
               ctx.setAttribute('aria-checked', 'true');
               ctx.classList.add('selected');
               if (!$(ctx).find('input')[0]) {
                  $(ctx).append('<input type="radio" checked="checked" name="' + name + '">');
               } else {
                  $(ctx).find('input').attr('checked','checked');
               }
            } else {
               if (!$(ctx).find('input')[0]) {
                  $(ctx).append('<input type="radio" name="' + name + '">');
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
            $(item).find('input').attr('checked','checked');
            if (options && options.callback) {
               options.callback.apply(this, arguments);
            }
         });
      },
      
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
         var stepper = this[0];
         var start = options.start;
         var end = options.end;
         var defaultValue = options.defaultValue ? options.defaultValue : options.start;
         var increaseSymbol = '+';
         var decreaseSymbol = '-';
         if ($.isWin) {
             increaseSymbol = '';
             decreaseSymbol = '';
         }
         var decreaseButton = '<a href="javascript:void(null)" class="button decrease">' + decreaseSymbol + '</a>';
         var label = '<label>' + defaultValue + '</label><input type="text" value="' + defaultValue + '">';
         var increaseButton = '<a href="javascript:void(null)" class="button increase">' + increaseSymbol + '</a>';
         $(stepper).append(decreaseButton + label + increaseButton);
         $(stepper).data('ui-value', {start: start, end: end, defaultValue: defaultValue});
         
         var decreaseStepperValue = function() {
            var currentValue = $(stepper).find('input').val();
            var value = $(stepper).data('ui-value');
            var start = value.start;
            var newValue;
            if (currentValue <= start) {
               $(this).addClass('disabled');
            } else {
               newValue = Number(currentValue) - 1;
               $(stepper).find('.button:last-of-type').removeClass('disabled');
               $(stepper).find('label').text(newValue);
               $(stepper).find('input')[0].value = newValue;
               if (currentValue === start) {
                  $(this).addClass('disabled');
               }
            }  
         };
         
         var increaseStepperValue = function() {
            var currentValue = $(stepper).find('input').val();
            var value = $(stepper).data('ui-value');
            var end = value.end;
            var newValue;
            if (currentValue >= end) {
               $(this).addClass('disabled');
            } else {
               newValue = Number(currentValue) + 1;
               $(stepper).find('.button:first-of-type').removeClass('disabled');
               $(stepper).find('label').text(newValue);
               $(stepper).find('input')[0].value = newValue;
               if (currentValue === end) {
                  $(this).addClass('disabled');
               }
            }
         };
         var $stepper = (window && window.jQuery && $ === jQuery) ? $(stepper) : [stepper];
         $stepper.find('.button:first-of-type').on('singletap', function() {
            decreaseStepperValue.call(this, stepper);
         });
         $stepper.find('.button:last-of-type').on('singletap', function() {
            increaseStepperValue.call(this, stepper);
         });
      },
      
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
         options = options || {};
         var $this = this;
         var color = options.color || '#000';
         var size = options.size || '80px';
         var position = (options && options.position === 'right') ? 'align-flush' : null;
         var duration = options.duration || '2s';
         var spinner;
         // For iOS:
         var iOSBusy = function() {
            var webkitAnim = {'-webkit-animation-duration': duration};
            spinner = $.make('<span class="busy"></span>');
            $(spinner).css({'background-color': color, 'height': size, 'width': size});
            $(spinner).css(webkitAnim);
            $(spinner).attr('role','progressbar');
            if (position) $(spinner).addClass(position);
            $this.append(spinner);
            return this;
         };
         // For Android:
         var androidBusy = function() {
            var webkitAnim = {'-webkit-animation-duration': duration};
            spinner = $.make('<div class="busy"><div></div><div></div></div>');
            $(spinner).css({'height': size, 'width': size, "background-image":  'url(' + '"data:image/svg+xml;utf8,<svg xmlns:svg=' + "'http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' version='1.1' x='0px' y='0px' width='400px' height='400px' viewBox='0 0 400 400' enable-background='new 0 0 400 400' xml:space='preserve'><circle fill='none' stroke='" + color + "' stroke-width='20' stroke-miterlimit='10' cx='199' cy='199' r='174'/>" + '</svg>"' + ')'});
            $(spinner).css(webkitAnim);
            $(spinner).attr('role','progressbar');
            $(spinner).innerHTML = "<div></div><div></div>";
            if (position) $(spinner).addClass('align-' + position);
            $this.append(spinner);
            return this;
         };
         // For Windows 8/WP8:
         var winBusy = function() {
            spinner = $.make('<progress class="busy"></progress>');
            $(spinner).css({ 'color': color });
            $(spinner).attr('role','progressbar');
            $(spinner).addClass('win-ring');
            if (position) $(spinner).addClass('align-' + position);
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
      },
      
      //////////////////////////////
      // Center an Element on Screen
      //////////////////////////////
      UICenter : function ( ) {
         if (!this[0]) return;
         var $this = $(this);
         var parent = $this.parent();
         var position;
         if ($this.css('position') !== 'absolute') position = 'relative';
         else position = 'absolute';
         
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
      },
      
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
      },
      
      //////////////
      // Close Popup
      //////////////
      UIPopupClose : function ( ) {
         if (!this[0].classList.contains('popup')) return;
         $(this).UIUnblock();
         $(this).remove();
      },
      
      /////////////////
      // Create Popover
      /////////////////
      /*
         id: myUniqueID,
         title: 'Great',
         callback: myCallback
      */
      UIPopover : function ( options ) {
         if (!options) return [];
         var triggerEl = $(this);
         var triggerID;
         if (this[0].id) {
            triggerID = this[0].id;
         } else {
            triggerID = $.Uuid();
            triggerEl.attr('id', triggerID);
         }
         var id = options.id ? options.id : $.Uuid();
         var header = options.title ? ('<header><h1>' + options.title + '</h1></header>') : '';
         var callback = options.callback ? options.callback : $.noop;
         var popover = '<div class="popover" id="' + id + '">' + header + '<section></section></div>';
         
         // Calculate position of popover relative to the button that opened it:
         var _calcPopPos = function (element) {
            var offset = $(element).offset();
            var left = offset.left;
            var calcLeft;
            var calcTop;
            var popover = $('.popover');
            var popoverOffset = popover.offset();
            calcLeft = popoverOffset.left;
            calcTop = offset.top + $(element)[0].clientHeight;
            if ((popover.width() + offset.left) > window.innerWidth) {
               popover.css({
                  'left': ((window.innerWidth - popover.width())-20) + 'px',
                  'top': (calcTop + 20) + 'px'
               });
            } else {
               popover.css({'left': left + 'px', 'top': (calcTop + 20) + 'px'});
            }
         };

         $(this).on($.eventStart, function() {
            var $this = this;
            $(this).addClass('selected');
            setTimeout(function() {
               $($this).removeClass('selected');
            }, 1000);
            $.body.append(popover);
            $('.popover').UIBlock('.5');
            var event = 'singletap';
            if ($.isWin && $.isDesktop) {
               event = $.eventStart + ' singletap ' + $.eventEnd;
            }
            $('.mask').on(event, function(e) {
               e.preventDefault();
               e.stopPropagation();
            });
            $('.popover').data('triggerEl', triggerID);
            if ($.isWin) {
               _calcPopPos($this);
               $('.popover').addClass('open');
            } else {
               $('.popover').addClass('open');
               setTimeout(function () {
                   _calcPopPos($this);
               });
            }
            callback.call(callback, $this);
         });
      }
      
   });
