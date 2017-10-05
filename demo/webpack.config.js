const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtool: 'inline-sourcemap',
  entry: {
    bundle: './entry.js',
  },
  resolve: {
    alias: {
      '@src': path.join(__dirname, '../src'),
    },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    port: 3000,
  },
};
