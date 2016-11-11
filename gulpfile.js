const gulp = require('gulp');
const babel = require('babel-loader');
var webpack = require('webpack-stream');
var merge = require('merge-stream');

gulp.task('default', () => {
  var javascript =  gulp.src('src/**/*.js')
    .pipe(webpack({
      watch: true,
      output: {
        filename: 'app.js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel', // 'babel-loader' is also a valid name to reference
            query: {
              presets: ['es2015']
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest('dist'));

  var html = gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'));

  return merge(javascript, html)
});
