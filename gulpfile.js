const gulp = require('gulp');
const webpack = require('webpack');
const merge = require('merge-stream');
const watch = require('gulp-watch');
const WebpackDevServer = require("webpack-dev-server");
const gutil = require("gulp-util");
const path = require("path");

var webpack_config = {
  entry: {
    app: ["./src/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: '/assets/',
    filename: "bundle.js"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};

gulp.task('default', () => {
  var javascript =  gulp.src('src/**/*.js')
                        .pipe(webpack())
                        .pipe(gulp.dest('dist'));

  var html = watch('src/**/*.html', function() {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'));
  });

  return merge(javascript, html);
});


gulp.task("webpack-dev-server", function(callback) {
  // Start a webpack-dev-server
  var compiler = webpack(webpack_config);

  var html = watch('src/**/*.html', function() {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'));
  });

  new WebpackDevServer(compiler, {
    publicPath: webpack_config.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(4200, "localhost", function(err) {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    // Server listening
    gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

    // keep the server alive or continue?
    // callback();
  });
});

function onError(err) {
  console.log(err);
  this.emit('end');
}
