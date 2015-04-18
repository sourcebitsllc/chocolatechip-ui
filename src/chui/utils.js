(function($) {
  "use strict";
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
})(window.$);