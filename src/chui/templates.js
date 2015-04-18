(function($) {
  "use strict";
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
})(window.$);