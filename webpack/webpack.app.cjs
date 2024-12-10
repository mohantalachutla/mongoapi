const { getFallbackConfig, getNodeExternalsPlugin } = require("../scripts/index.cjs");

const nodeModules = {
  assert: false,
  buffer: false,
  console: false,
  constants: false,
  crypto: false,
  domain: false,
  events: false,
  fs: false,
  http: false,
  https: false,
  net: false,
  os: false,
  path: true,
  punycode: false,
  process: false,
  querystring: false,
  stream: false,
  string_decoder: false,
  timers: false,
  tty: false,
  url: false,
  util: false,
  vm: false,
  zlib: false,
};

const appModules = {
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
};



module.exports = {
  resolve: {
    fallback: {
      // core node modules
      ...getFallbackConfig(nodeModules),
      // app modules
      ...getFallbackConfig(appModules),
    },
  },
  externals: [
    getNodeExternalsPlugin(),
  ],
};