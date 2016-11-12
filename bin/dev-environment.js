var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var webpack_config = require("./webpack.config.js");

//config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");

var compiler = webpack(webpack_config);
var server = new WebpackDevServer(compiler, {
  //publicPath: webpack_config.output.publicPath,
  contentBase: 'dist',
  stats: {
    colors: true
  }
});

server.listen(4200);
