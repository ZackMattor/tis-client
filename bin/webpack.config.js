var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require("path");
var webpack = require("webpack");

module.exports = {
  cache: true,

  entry: {
    app: ["./src/javascripts/app.js"]
  },

  output: {
    path: '/Users/zmattor/work/arksaw/game/client/dist',
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
    new webpack.HotModuleReplacementPlugin()
  ]
};
