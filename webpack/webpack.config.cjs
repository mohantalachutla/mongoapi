const { merge } = require('webpack-merge');

const commonConfig = require('./webpack.common.cjs');
const appConfig = require('./webpack.app.cjs');

/**
 * The function returns a webpack configuration object based on mode.
 * @function
 * @param {Object} env - Webpack environment variables
 * @param {Object} argv - Webpack CLI arguments
 * @param {string} argv.mode - Webpack mode (development or production)
 * @returns {Object} Webpack configuration
 * @throws Will throw an error if mode is not set or not found
 */
module.exports = (env, { mode }) => {
  let config = {};
  try {
    switch (mode) {
      case 'development':
        config = require('./webpack.dev.cjs');
        break;
      case 'production':
        config = require('./webpack.prod.cjs');
        break;
      default:
        throw new Error(
          'webpack/webpack.config.js: Environment not set or not found'
        );
    }
    return merge(commonConfig, config, appConfig);
  } catch {
    throw new Error(
      'webpack/webpack.config.js: Environment not set or not found'
    );
  }
};
