var loaderUtils = require('loader-utils');

module.exports = function(content) {
  this.cacheable && this.cacheable();
  var query = loaderUtils.parseQuery(this.query);
  var scriptString = content.toString().replace(/\n$/, '');
  var scriptEscaped = escape(scriptString);

  var exportedFunction =
`module.exports = function() {
  var args = Array.prototype.slice.call(arguments);

  var callback;
  if (typeof args[args.length - 1] === 'function') {
    callback = args[args.length - 1];
  }

  if (args.length > 1) args.splice(-1,1); // remove callback

  var argsStringified = JSON.stringify(args);

  var cs;
  if (window.CSInterface) {
    cs = new window.CSInterface();
  } else if (window.parent.CSInterface) {
    cs = new window.parent.CSInterface()
  } else {
    throw Error("[extend-script-loader]: CSInterface not found. Are you sure it's included?")
  }

  cs.evalScript(\`(function() {
    try {
      var result = eval(unescape("${scriptEscaped}"));
      if (typeof result === 'function') result = result.apply(this, \${argsStringified});
      result = JSON.stringify({result: result});
      return result;
    } catch (err) {
      return JSON.stringify({error: err});
    };
  })()\`, function(result) {
    result = JSON.parse(result);

    if (result.error) {
      var error = result.error;
      if (callback) callback(error);
      var errorMessage = error.name + " " + error.fileName + ":" + error.line + " " + error.message;
      console.error(errorMessage);
      return;
    }

    if (callback) callback(undefined, result.result);
  });
}`;

  return exportedFunction;
}
module.exports.raw = true;
