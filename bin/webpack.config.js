var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require("path");

module.exports = {
  entry: {
    app: ["./src/index.js"]
  },

  output: {
    path: '/Users/zmattor/work/arksaw/game/client/dist',
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
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/index.html' }
    ])
  ]
};
