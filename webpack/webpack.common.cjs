const Dotenv = require('dotenv-webpack');
const path = require('path');
const NodeExternals = require('webpack-node-externals');
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const packageJson = require(path.resolve(__dirname, '../package.json'));

const appUrl = `${packageJson.app.host}:${packageJson.app.port}/`;

module.exports = {
  entry: {
    index: path.resolve(__dirname, '../src/index.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../lib'),
    publicPath: appUrl,
  },

  target: 'node', // target web or node


  resolve: {
    modules: [path.resolve(__dirname, '../src'), 'node_modules'],
    alias: {
      '#': path.resolve(__dirname, '../'),
    },
    mainFiles: ['index'],
    extensions: ['.js', '.json'],
    enforceExtension: false,
    mainFields: ['browser', 'module', 'main'],
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  plugins: [
    new Dotenv(),
    // new NodePolyfillPlugin(), // to inject polyfills
  ],
  externals: [
    NodeExternals({
      modulesDir: path.resolve(__dirname, '../node_modules'),
    }),
  ],
};
