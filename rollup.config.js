import merge from 'deepmerge'
import base from './rollup.config.base.js'

export default merge(base, {
  output: {
    file: 'dist/docsify-pagination.js',
    format: 'umd',
    name: 'docsify-pagination',
  },
})
