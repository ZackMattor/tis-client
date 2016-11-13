var webpack = require("webpack");
var webpack_config = require("./webpack.config.js");

var compiler = webpack(webpack_config, function(err, stats) {
  if (err) { console.log(err) }
  console.log('[webpack:build]', stats.toString({
    //chunks: false, // quiet things down a bit
    colors: true
  }));
});
