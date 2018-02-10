var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require("path");
var webpack = require("webpack");

console.log("Saving to - " + __dirname + '/dist');

module.exports = {
  entry: {
    app: ["./src/javascripts/app.js"]
  },

  output: {
    path: __dirname + '/dist',
    filename: "bundle.js"
  },

  devServer: {
    inline: true
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/index.html' }
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'TIS_HTTP_ENDPOINT': JSON.stringify(process.env.TIS_HTTP_ENDPOINT || "http://localhost:8080"),
        'TIS_WS_ENDPOINT': JSON.stringify(process.env.TIS_WS_ENDPOINT || "ws://localhost:8080")
      }
    })

  ]
};
