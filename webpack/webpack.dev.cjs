// const path = require('path');

// const packageJson = require(path.resolve(__dirname, '../package.json'));
// const port = packageJson.app.port;

module.exports = {
  // using nodemon over webpack-dev-server due to express integration issue
  // devServer: {
  //   port: port,
  //   historyApiFallback: true,
  //   watchFiles: [path.resolve(__dirname, '../src')],
  // static: {
  //   directory: path.join(__dirname, 'dist'), // Serve files from dist
  // },
  // hot: true
  // },
  devtool: 'eval-source-map',
  stats: 'errors-warnings',
};
