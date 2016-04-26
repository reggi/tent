module.exports = function (key, value) {
  return function () {
    return {
      [key]: value
    }
  }
}
