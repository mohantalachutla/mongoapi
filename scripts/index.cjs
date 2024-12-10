const fs = require('fs');
const process = require('process');
const path = require('path');
const _ = require('lodash');
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin'); // broken. look for alternatives
/**
 * Recursively get all files in a directory that match the given extensions
 * and do not match the given exclude extensions.
 *
 * @param {string} entry - The directory to search in.
 * @param {string[]} [extensions=[]] - The file extensions to include.
 * @param {string[]} [excludeExtensions=[]] - The file extensions to exclude.
 * @returns {string[]} - An array of paths to the files found.
 */
const getFiles = (entry, extensions = [], excludeExtensions = []) => {
  let fileNames = [];
  const dirs = fs.readdirSync(entry);

  dirs.forEach((dir) => {
    const path = `${entry}/${dir}`;

    if (fs.lstatSync(path).isDirectory()) {
      fileNames = [
        ...fileNames,
        ...getFiles(path, extensions, excludeExtensions),
      ];

      return;
    }

    if (
      !excludeExtensions.some((exclude) => dir.endsWith(exclude)) &&
      extensions.some((ext) => dir.endsWith(ext))
    ) {
      fileNames.push(path);
    }
  });

  return fileNames;
};

const isProd = function () {
  return process.env.NODE_ENV === 'production';
};

const isDev = function () {
  return process.env.NODE_ENV === 'development';
};

const getFallbackConfig = (config={}) => (_.chain(config).toPairs().filter( ([key, value]) => value === false && _.isString(key)).fromPairs().value() ?? {});
const getPolyfillConfig = (config={}) => (_.chain(config).toPairs().filter( ([key, value]) => value === true && _.isString(key)).map( ([key]) => key).value() ?? []);
// const getPolyfillPlugin = (config) => new NodePolyfillPlugin({ additionalAliases: getPolyfillConfig(config) });

const getNodeExternalsPlugin =  () =>    {
  const NodeExternals = require('webpack-node-externals')
  return NodeExternals({
    modulesDir: path.resolve(__dirname, '../node_modules'),
  })
}

module.exports = {
  getFiles,
  isProd,
  isDev,
  getPolyfillConfig,
  getFallbackConfig,
  // getPolyfillPlugin,
  getNodeExternalsPlugin
}
