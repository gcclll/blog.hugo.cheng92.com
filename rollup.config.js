import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
// import injectProcessEnv from 'rollup-plugin-inject-process-env'
import { terser } from 'rollup-plugin-terser'
import scss from 'rollup-plugin-scss'

export default {
  input: 'src/main.js',
  output: {
    file: './assets/js/dist/global.js',
    format: 'iife'
    // format: 'cjs'
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    // injectProcessEnv({
    //   NODE_ENV: 'production',
    //   SOME_OBJECT: { one: 1, two: [1, 2], three: '3' },
    //   UNUSED: null
    // }),
    nodeResolve(),
    terser(),
    // https://www.npmjs.com/package/rollup-plugin-scss
    scss({
      output: './assets/css/global.css',
      sourceMap: true
    })
  ],
  watch: {
    include: 'src/**'
  }
}
