module.exports = function (action, delay) {
  let last = 0
  return function () {
    const cur = +new Date()
    if (cur - last > delay) {
      action.apply(this, arguments)
      last = cur
    }
  }
}