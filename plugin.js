const fs = require('fs')
const path = require('path')

function ExtendScriptPlugin(options) {}

function readFile(file) {
  return fs.readFileSync(path.join(__dirname, file)).toString()
}

ExtendScriptPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {

    compilation.assets['interface.es'] = {
      source: function() {
        return readFile('lib/CSInterface.js')
      },
      size: function() {
        return 1
      }
    }

    compilation.assets['json.es'] = {
      source: function() {
        return readFile('lib/JSON.es')
      },
      size: function() {
        return 1
      }
    }

    callback()
  })
}

module.exports = ExtendScriptPlugin
