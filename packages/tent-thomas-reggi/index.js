var tentBabelDeps = require('tent-babel-deps')
var tentBabel = require('tent-babel')

function tentAnything (key, value) {
  return function () {
    return {
      [key]: value
    }
  }
}

module.exports = [
  tentAnything('author', 'Thomas Reggi'),
  tentBabel(),
  tentBabelDeps()
]
