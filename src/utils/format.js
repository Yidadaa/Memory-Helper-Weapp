/**
 * @file: 日期格式化函数
 */

module.exports = function (fmt, date = new Date()) {
  const d = new Date(date)
  const regs = {
    'Y+': d.getFullYear(),
    'M+': d.getMonth() + 1,
    'D+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds()
  }
  for (let r in regs) {
    fmt = fmt.replace(new RegExp(r), t => regs[r].toString().padStart(t.length, 0))
  }
  return fmt
}