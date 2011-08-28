(function () {
    var Footprint = function () {};
      // Default template settings, uses ASP/PHP/JSP delimiters, change the
      // following template settings to use alternative delimiters.
    var templateSettings = {
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g
    };

      // JavaScript micro-templating, similar to John Resig's implementation.
      // Underscore templating handles arbitrary delimiters, preserves whitespace,
      // and correctly escapes quotes within interpolated code.
    Footprint.compile = function(str, settings) {
        var c  = settings || templateSettings;
        var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
          'with(obj||{}){__p.push(\'' +
          str.replace(/\\/g, '\\\\')
             .replace(/'/g, "\\'")
             .replace(c.interpolate, function(match, code) {
               return "'," + code.replace(/\\'/g, "'") + ",'";
             })
             .replace(c.evaluate || null, function(match, code) {
               return "');" + code.replace(/\\'/g, "'")
                                  .replace(/[\r\n\t]/g, ' ') + "__p.push('";
             })
             .replace(/\r/g, '\\r')
             .replace(/\n/g, '\\n')
             .replace(/\t/g, '\\t')
             + "');}return __p.join('');";
        return new Function('obj', tmpl);
    };

    // Preserves template method for compatible with legacy call.
    Footprint.template = function (str, data) {
        var compilied = Footprint.compile(str);
        return compilied(data);
    };
  
    if (typeof exports !== "undefined") {
        exports.Footprint = Footprint;
    } else {
        window.Footprint = Footprint;
    }
}());
