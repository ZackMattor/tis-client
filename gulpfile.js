const gulp = require('gulp');
const babel = require('babel-loader');
const concat = require('gulp-concat');
var webpack = require('webpack-stream');

gulp.task('default', () => {
  return gulp.src('src/**/*.js')
    .pipe(webpack({
      watch: true,
      output: {
        filename: 'foo.js'
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
});
