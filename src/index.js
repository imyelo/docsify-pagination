import { install } from './pagination'

window.$docsify = window.$docsify || {}

window.$docsify.plugins = [install].concat($docsify.plugins || [])
