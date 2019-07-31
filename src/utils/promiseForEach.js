function promiseForEach (funcs = []) {
  let results = new Array(funcs.length)
  let i = 0
  return new Promise(resolve => {
    const nextFunc = () => {
      if (i === funcs.length) resolve(results)
      else {
        funcs[i]().then(res => {
          results[i] = res
          i += 1
          nextFunc()
        })
      }
    }
    nextFunc()
  })
}

module.exports = promiseForEach