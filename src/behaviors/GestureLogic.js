/**
 * @file: 为组件添加一个手势动画逻辑，可以监听组件上的滑动操作
 * 
 */
module.exports = ({gestureID, threshold, endFuncName, direction}) => Behavior({
  data: {
    [`enable${gestureID}Gesture`]: false,
    [`${gestureID}Number`]: 0
  },

  methods: {
    [`on${gestureID}GestureStart`]: function (e) {
      if (!this.data[`enable${gestureID}Gesture`]) return
      const touch = e.changedTouches[0]
      this[`${gestureID}StartX`] = touch.clientX
      this[`${gestureID}StartY`] = touch.clientY
      this[`${gestureID}Triggered`] = false
      this[`${gestureID}Moved`] = false
      console.log(`[${gestureID}GestureStart]`, e)
    },
  
    [`on${gestureID}GestureMove`]: function (e) {
      this[`${gestureID}Moved`] = true
      if (!this.data[`enable${gestureID}Gesture`] || this[`${gestureID}Triggered`]) return
      const touch = e.changedTouches[0]
      const x = touch.clientX
      const y = touch.clientY
      this[`_set${gestureID}BaseNumber`](x, y)
    },
  
    [`on${gestureID}GestureEnd`]: function (e) {
      if (!this[`${gestureID}Triggered`]) this[`reset${gestureID}Gesture`]()
      this[`${gestureID}StartX`] = 0
      this[`${gestureID}StartY`] = 0
      console.log(`[${gestureID}GestureEnd]`, e)
    },

    [`reset${gestureID}Gesture`]: function (e) {
      this.setData({
        [`${gestureID}Number`]: 0
      })
    },

    [`_trigger${gestureID}EndFunc`]: function () {
      if (this[`${gestureID}Triggered`]) return
      wx.vibrateShort()
      if (this[endFuncName]) {
        this[endFuncName]()
      } else {
        console.error(`[${gestureID}] dose not have function: ${endFuncName}`)
      }
      this[`${gestureID}Triggered`] = true
    },

    [`_set${gestureID}BaseNumber`] (x, y) {
      /**
       * 处理映射关系
       */
      const startX = this[`${gestureID}StartX`]
      const startY = this[`${gestureID}StartY`]
      const deltaX = x - startX
      const deltaY = y - startY

      let number = 0
      const funcTable = {
        toBottom: () => deltaY,
        toTop: () => -deltaY,
        toLeft: () => -deltaX,
        toRight: () => deltaX,
        default: () => Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      }
      number = funcTable[direction || 'default']()

      number = number < 0 ? 0 : number // 大于等于0
      // 使用函数映射到[0, 1]区间内
      // number < thresholed : 线性映射 y = 0.9 * x
      // otherwise: 非线性映射 y = 0.9 + 0.1 * (1 - 1 / 2^x)
      number /= threshold
      if (number > 1) this[`_trigger${gestureID}EndFunc`]()
      number = number < 1
        ? 1 - (1 - number) * (1 - number)
        : 1 + 0.1 * (1 - Math.pow(0.5, number - 1))
      this.setData({
        [`${gestureID}Number`]: number
      })
    }
  }
})
