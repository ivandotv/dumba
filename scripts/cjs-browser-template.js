'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./__LIBRARY_NAME__.production.min.js')
} else {
  module.exports = require('./__LIBRARY_NAME__.development.js')
}
