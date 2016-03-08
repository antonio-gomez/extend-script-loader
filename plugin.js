const fs = require('fs')
const path = require('path')

function ExtendScriptPlugin(options) {}

ExtendScriptPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {

    var interface = fs.readFileSync(path.join(__dirname, './lib/CSInterface.js'))
    var json = fs.readFileSync(path.join(__dirname, './lib/JSON.es'))

    compilation.assets['interface.es'] = {
      source: function() {
        return interface.toString();
      },
      size: function() {
        return 1;
      }
    };

    compilation.assets['json.es'] = {
      source: function() {
        return json.toString();
      },
      size: function() {
        return 1;
      }
    };

    callback();
  });
};

module.exports = ExtendScriptPlugin;
