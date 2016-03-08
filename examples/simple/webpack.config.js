const webpack = require('webpack')
const path = require('path')
const ExtendScriptPlugin = require('../../plugin.js')

module.exports = {
  devtool: 'eval',
  debug: true,
  entry:   [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    path.join(__dirname, 'index.js'),
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    loaders: [
      {
        test:    /\.es?$/,
        exclude: /(node_modules|bower_components)/,
        loader:  path.join(__dirname, '../../index.js'), // replace with extend-script or extend-script-loader outside of this package
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtendScriptPlugin(),
  ],
}
