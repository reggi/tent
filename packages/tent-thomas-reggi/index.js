var tentBabelDeps = require('tent-babel-deps').default
var tentBabel = require('tent-babel').default

function tentAnything (key, value) {
  return function () {
    return {
      [key]: value
    }
  }
}

module.exports = [
  tentAnything('author', 'Thomas Reggi'),
  tentBabel({'presets': ['es2015']}),
  tentBabelDeps()
]
