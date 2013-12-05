   $.extend($, {
         
      UuidSeed : 0,

      Uuid : function() {
         var date;
         $.UuidSeed++;
         date = Date.now() + $.UuidSeed;
         return date.toString(36);
      },
      
      array : Array.prototype,

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
         var prevArticles = $.UINavigationHistory.splice(historyIndex+1);
         $.publish('chui/navigateBack/leave', currentArticle[0].id);
         $.publish('chui/navigateBack/enter', destination[0].id);
         currentArticle[0].scrollTop = 0;
         destination[0].scrollTop = 0;
         if (prevArticles.length) {
            prevArticles.forEach(function(ctx) {
               $(ctx).removeClass('previous').addClass('next');
               $(ctx).prev().removeClass('previous').addClass('next');
            });
         }
         if (window && window.jQuery && $ === window.jQuery) {
            if (currentArticle.next().hasClass('toolbar')) {
               currentToolbar = currentArticle.next('toolbar');
            } else {
               currentToolbar = $();
            }
            if (destination.next().hasClass('toolbar')) {
               destinationToolbar = destination.next('toolbar');
            } else {
               destinationToolbar = $();
            }
         } else {
            currentToolbar = currentArticle.next().hasClass('toolbar');
            destinationToolbar = destination.next().hasClass('toolbar');
         }
         destination.removeClass('previous').addClass('current');
         destination.prev().removeClass('previous').addClass('current');
         destinationToolbar.removeClass('previous').addClass('current');
         currentArticle.removeClass('current').addClass('next');
         currentArticle.prev().removeClass('current').addClass('next');
         currentToolbar.removeClass('current').addClass('next');
         $('.toolbar.previous').removeClass('previous').addClass('next');
         $.UISetHashOnUrl($.UINavigationHistory[$.UINavigationHistory.length-1]);
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
         $.publish('chui/navigateBack/leave', currentArticle[0].id);
         $.publish('chui/navigateBack/enter', destination[0].id);
         currentArticle[0].scrollTop = 0;
         destination[0].scrollTop = 0;
         if (window && window.jQuery && $ === window.jQuery) {
            if (currentArticle.next().hasClass('toolbar')) {
               currentToolbar = currentArticle.next('.toolbar');
               
            } else {
               currentToolbar = $();
            }
            if (destination.next().hasClass('toolbar')) {
               destinationToolbar = destination.next('.toolbar');
            } else {
               destinationToolbar = $();
            }
         } else {
            currentToolbar = currentArticle.next().hasClass('toolbar');
            destinationToolbar = destination.next().hasClass('toolbar');
         }

         destination.removeClass('previous').addClass('current');
         destination.prev().removeClass('previous').addClass('current');
         destinationToolbar.removeClass('previous').addClass('current');
         currentArticle.removeClass('current').addClass('next');
         currentArticle.prev().removeClass('current').addClass('next');
         currentToolbar.removeClass('current').addClass('next');
         $.UISetHashOnUrl($.UINavigationHistory[histLen-2]);
         if ($.UINavigationHistory[histLen-1] !== $.firstArticle[0].id) {
            $.UINavigationHistory.pop();
         }
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
         var destinationNav = destination.prev();
         var currentToolbar;
         var destinationToolbar;
         $.publish('chui/navigate/leave', current[0].id);
         $.UINavigationHistory.push(destination);
         $.publish('chui/navigate/enter', destination[0].id);
         current[0].scrollTop = 0;
         destination[0].scrollTop = 0;     
         if (window && window.jQuery && $ === window.jQuery) {
            if (current.next().hasClass('toolbar')) {
               currentToolbar = current.next('.toolbar');
            } else {
               currentToolbar = $();
            }
            if (destination.next().hasClass('toolbar')) {
               destinationToolbar = destination.next('.toolbar');
            } else {
               destinationToolbar = $();
            }
         } else {
            currentToolbar = current.next().hasClass('toolbar');
            destinationToolbar = destination.next().hasClass('toolbar');
         }
         current.removeClass('current').addClass('previous');
         currentNav.removeClass('current').addClass('previous');
         currentToolbar.removeClass('current').addClass('previous');
         destination.removeClass('next').addClass('current');
         destinationNav.removeClass('next').addClass('current');
         destinationToolbar.removeClass('next').addClass('current');
         
         $.UISetHashOnUrl(destination[0].id);
         setTimeout(function() {
            $.isNavigating = false;
         }, 500);
      },
      
      ////////////////////////////
      // Initialize Deletable List
      ////////////////////////////
      UIDeletable : function ( options ) {
         /*
            options = {
               list: selector,
               editLabel : labelName || Edit,
               doneLabel : labelName || Done,
               deleteLabel : labelName || Delete,
               placement: left || right,
               callback : callback
            }
         */
         if (!options || !options.list || !options instanceof Array) {
            return;
         }
         var list = $(options.list);
         var editLabel = options.editLabel || 'Edit';
         var doneLabel = options.doneLabel || 'Done';
         var deleteLabel = options.deleteLabel || 'Delete';
         var placement = options.placement || 'right';
         var callback = options.callback || $.noop;
         var deleteButton;
         var editButton;
         var deletionIndicator;
         // Windows uses an icon for the delete button:
         if ($.isWin) deleteLabel = '';
         var setupDeletability = function(callback) {
            var deleteSlide;
            if ($.isiOS) {
               deleteSlide = '100px';
            } else if ($.isAndroid) {
               deleteSlide = '140px';
            }
            $(function() {
               $.body.off('singletap', '.edit');
               $.body.on('singletap', '.edit', function() {
                  var $this = this;
                  setTimeout(function() {
                     $this.classList.remove('edit');
                     $this.classList.add('done');
                     $($this).text(doneLabel);
                     $(list).addClass('showIndicators');
                  });
               });
               $.body.off('singletap', '.done');
               $.body.on('singletap', '.done', function() {
                  var $this = this;
                  setTimeout(function() {
                     $this.classList.remove('done');
                     $this.classList.add('edit');
                     $($this).text(editLabel);
                     $(list).removeClass('showIndicators');
                     $(list).find('li').removeClass('selected');
                  });
               });
               $(list).on('singletap', '.deletion-indicator', function() {
                  if ($(this).closest('li')[0].classList.contains('selected')) {
                     $(this).closest('li').removeClass('selected');
                     return;
                  } else {
                     $(this).closest('li').addClass('selected');
                  }
               });
               
               if ($.isiOS || $.isSafari) {
                  $(list).on('swiperight', 'li', function() {
                     $(this).removeClass('selected');
                  });
               }
               $(list).on('singletap', '.delete', function() {
                  var $this = this;
                  $(this).siblings().css({'-webkit-transform': 'translate3d(-1000%,0,0)', '-webkit-transition': 'all 1s ease-out'});
                  setTimeout(function() {
                     callback.call(callback, $this);
                     $($this).parent().remove();
                  }, 500);
               });
            });         
         };
         if (list[0].classList.contains('deletable')) return;
            var height = $('li').eq(1)[0].clientHeight;
            deleteButton = $.concat('<a href="javascript:void(null)" class="button delete">', deleteLabel, '</a>');
            editButton = $.concat('<a href="javascript:void(null)" class="button edit">', editLabel, '</a>');
            deletionIndicator = '<span class="deletion-indicator"></span>';
            if (placement === 'left') {
               list.closest('article').prev().prepend(editButton);
            } else {
               list.closest('article').prev().append(editButton);
               list.closest('article').prev().find('h1').addClass('buttonOnRight');
               list.closest('article').prev().find('.edit').addClass('align-flush');
            }
            list.find('li').prepend(deletionIndicator);
            list.find('li').append(deleteButton);
            $('li').find('.delete').each(function(ctx, idx) {
               if (window && window.jQuery && $ === window.jQuery) ctx = idx;
               if ($.isiOS || $.isSafari) $(ctx).css({height: height + 'px'});
            });
            setupDeletability(callback);
         
         list.addClass('deletable');
         return list;
      },
      
      ///////////////////////
      // Setup Paging Control
      ///////////////////////
      UIPaging : function ( ) {
         var currentArticle = $('.segmented.paging').closest('nav').next();
         var sections = currentArticle.children().length;
         if (window && window.jQuery && $ === window.jQuery) {
            if ($('.segmented.paging').hasClass('horizontal')) {
               currentArticle.addClass('horizontal');
            } else if ($('.segmented.paging').hasClass('vertical')) {
               currentArticle.addClass('vertical');
            }        
         } else {
            if ($('.segmented.paging').hasClass('horizontal')[0]) {
               currentArticle.addClass('horizontal');
            } else if ($('.segmented.paging').hasClass('vertical')[0]) {
               currentArticle.addClass('vertical');
            }
         }
         currentArticle.children().eq(0).addClass('current');
         currentArticle.children().eq(0).siblings().addClass('next');
         
         $('.segmented.paging').on($.eventStart, '.button:first-of-type', function() {
            var currentSection;
            $(this).next().removeClass('selected');
            $(this).addClass('selected');
            currentSection = $('section.current');
            if (currentSection.index() === 0) return;
            currentSection.removeClass('current').addClass('next');
            currentSection.prev().removeClass('previous').addClass('current');
         });
         $('.segmented.paging').on($.eventStart, '.button:last-of-type', function() {
            var currentSection;
            $(this).prev().removeClass('selected');
            $(this).addClass('selected');
            if (this.classList.contains('disabled')) return;
            currentSection = $('section.current');
            if (currentSection.index() === sections -1) return;
            currentSection.removeClass('current').addClass('previous');
            currentSection.next().removeClass('next').addClass('current');
         });
      },
      
      UISlideout : function ( position ) {
         var slideoutButton = $.make("<a class='button slide-out-button' href='javascript:void(null)'></a>");
         var slideOut = '<div class="slide-out"><section></section></div>';
         $('article').removeClass('next');
         $('article').removeClass('current');
         $('article').prev().removeClass('next');
         $('article').prev().removeClass('current');
         position = position || 'left';
         $.body.append(slideOut);
         $.body.addClass('slide-out-app');
         $('article:first-of-type').addClass('show');
         $('article:first-of-type').prev().addClass('show');
         $('#global-nav').append(slideoutButton);
         $('.slide-out-button').on($.eventStart, function() {
            $('.slide-out').toggleClass('open');
         });
         $('.slide-out').on('singletap', 'li', function() {
            var whichArticle = '#' + $(this).attr('data-show-article');
            $.UINavigationHistory[0] = whichArticle;
            $.UISetHashOnUrl(whichArticle);
            $.publish('chui/navigate/leave', $('article.show')[0].id);
            $.publish('chui/navigate/enter', whichArticle);
            $('.slide-out').removeClass('open');
            $('article').removeClass('show');
            $('article').prev().removeClass('show');
            $(whichArticle).addClass('show');
            $(whichArticle).prev().addClass('show');
         });
      },

      ///////////////////////////////////////////
      // Pass the id of the stepper to reset.
      // It's value will be reset to the default.
      ///////////////////////////////////////////
      // Pass it the id of the stepper:
      UIResetStepper : function ( stepper ) {
         var defaultValue = $(stepper).data('ui-value').defaultValue;
         $(stepper).find('label').html(defaultValue);
         $(stepper).find('input')[0].value = defaultValue;
      }
   });
