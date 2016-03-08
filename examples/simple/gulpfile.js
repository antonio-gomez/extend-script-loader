const gulp = require('gulp')
const gutil = require('gulp-util')
const fs = require('fs')
const path = require('path')
const del = require('del')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const exec = require('child_process').exec

const CEP_EXTENSIONS_PATH = path.join(process.env.HOME, 'Library/Application\ Support/Adobe/CEP/extensions')

gulp.task('build:copy', () => {
  return gulp.src(['CSXS/*', '.debug', 'index.html', 'extension.html'], { base: '.' })
    .pipe(gulp.dest('build'))
})

gulp.task('build:webpack', (done) => {
  webpack(require('./webpack.config.js'), (err, stats) => {
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString())
    done()
  })
})

gulp.task('build:server', (done) => {
  new WebpackDevServer(webpack(require('./webpack.config.js')), {
    contentBase: path.join(__dirname, 'build'),
    publicPath: '/',
    hot: true,
  }).listen(3000, 'localhost', (err) => {
    if (err) throw new debug.PluginError('webpack-dev-server', err)
    gutil.log('[webpack-dev-server]', `http://localhost:${3000}`)
    done()
  })
})

gulp.task('dev:link', (done) => {
  const target = path.join(CEP_EXTENSIONS_PATH, 'com.extend-script-loader.simple')
  del.sync(target, { force: true })
  fs.symlinkSync(path.join(__dirname, 'build'), target)
  done()
})

gulp.task('dev:debug-enable', (done) => {
  exec(`
    defaults write com.adobe.CSXS.6 PlayerDebugMode 1;
    defaults write com.adobe.CSXS.5 PlayerDebugMode 1;
    defaults write com.adobe.CSXS.4 PlayerDebugMode 1;
  `, done)
})

gulp.task('dev:debug-disable', (done) => {
  exec(`
    defaults delete com.adobe.CSXS.6 PlayerDebugMode;
    defaults delete com.adobe.CSXS.5 PlayerDebugMode;
    defaults delete com.adobe.CSXS.4 PlayerDebugMode;
  `, done)
})

gulp.task('default', gulp.series(gulp.parallel('dev:debug-enable', 'build:copy', 'build:server'), 'dev:link'))
