import commonjs from 'rollup-plugin-commonjs'
import nodejs from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  plugins: [
    babel(),
    nodejs(),
    commonjs(),
  ],
}
