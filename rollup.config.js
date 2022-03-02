import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'

export default {
  input: 'src/main.js',
  output: {
    file: './assets/js/dist/global.js',
    format: 'iife'
  },
  plugins: [resolve(), babel({ babelHelpers: 'bundled' })],
  watch: {
    include: ['./src']
  }
}
