var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

module.exports = {
  entry: './src/app.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: "backend.js"
  },
  plugins: [
    new webpack.IgnorePlugin(/vertx/),
  ]
}