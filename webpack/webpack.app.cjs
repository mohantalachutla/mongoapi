module.exports = {
  resolve: {
    fallback: {
      // core node modules
      process: require.resolve('process/browser'),
      path: require.resolve('path-browserify'),
      assert: false,
      util: false,
      buffer: false,
      fs: false,
      http: false,
      https: false,
      stream: false,
      zlib: false,
      os: false,
      url: false,
      net: false,
      crypto: false,

      // mongodb
      'aws-crt': false,
      'bson-ext': false,
      kerberos: false,
      '@mongodb-js/zstd': false,
      snappy: false,
      aws4: false,
      'mongodb-client-encryption': false,
      sharp: false,
      '@img/sharp-wasm32/versions': false,
      '@img/sharp-libvips-dev/cplusplus': false,
      '@img/sharp-libvips-dev/include': false,
    },
  },
};
