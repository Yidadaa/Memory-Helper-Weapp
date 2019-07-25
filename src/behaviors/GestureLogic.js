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
      const touch = e.changedTouches[0]
      this.startX = touch.clientX
      this.startY = touch.clientY
      this.triggered = false
    },
  
    [`on${gestureID}GestureMove`]: function (e) {
      if (!this.data[`enable${gestureID}Gesture`] || this.triggered) return
      const touch = e.changedTouches[0]
      const x = touch.clientX
      const y = touch.clientY
      this[`_set${gestureID}BaseNumber`](x, y)
    },
  
    [`on${gestureID}GestureEnd`]: function (e) {
      this.startX = 0
      this.startY = 0
      if (this[endFuncName]) {
        this[`_trigger${gestureID}EndFunc`]()
      } else {
        console.error(`[${gestureID}] dose not have function: ${endFuncName}`)
      }
    },

    [`reset${gestureID}Gesture`]: function (e) {
      this.setData({
        [`${gestureID}Number`]: 0
      })
    },

    [`_trigger${gestureID}EndFunc`]: function () {
      if (this.triggered) return
      this[endFuncName]()
      this.triggered = true
    },

    [`_set${gestureID}BaseNumber`] (x, y) {
      /**
       * 处理映射关系
       */
      const {startX, startY} = this
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
