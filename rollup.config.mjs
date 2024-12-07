// rollup.config.js
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
const isProd = process.env.NODE_ENV === 'production'

export default {
  input: 'main.js',
  output: [
    {
      file: 'lib/index.js',
      format: 'esm',
    },
    {
      file: 'lib/index.cjs',
      format: 'cjs',
    },
  ],
  plugins: [
    resolve(),
    json(),
    commonjs(),
    isProd && import('@rollup/plugin-terser').then((terser) => terser.default),
    // configure plugins for eslint, prettier, and husky
  ],
}
