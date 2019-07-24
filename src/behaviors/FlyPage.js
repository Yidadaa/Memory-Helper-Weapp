module.exports = Behavior({
  properties: {
    shouldFly: {
      type: Boolean,
      value: false
    }
  },

  data: {
    isFly: false,
    // 飞出页面的原始位移，高度等信息
    topOffset: 0,
    leftOffset: 0,
    contentHeight: 0,
    // 屏幕尺寸
    screenHeight: 0,
    screenWidth: 0,
    // 飞行动画
    flyAnimation: null,
    flyBackAnimation: null
  },

  observers: {
    'shouldFly': function (shouldFly) {
      if (shouldFly === this.data.isFly) return
      shouldFly ? this.flyIt() : this.closeIt()
    }
  },

  methods: {
    flyIt () {
      this.createSelectorQuery().select(this.data.flySelector).boundingClientRect().exec(res => {
        res = res[0]
        this.setData({
          isFly: true,
          topOffset: res.top,
          leftOffset: res.left,
          contentHeight: res.height,
          flyAnimation: this.buildTransition(this.data.screenWidth, this.data.screenHeight, -res.top, -res.left, true),
          flyBackAnimation: this.buildTransition(res.width, res.height, 0, 0)
        })
      })
    },

    closeIt (e) {
      this.setData({
        isFly: false,
        flyAnimation: this.data.flyBackAnimation
      })
    },

    buildTransition (width, height, top, left, onTop = false) {
      /**
       * 构建页面动画
       */
      return `transition: all .5s ease;
        width: ${width}px; height: ${height}px;
        transform: translate(${left}px, ${top}px);
        ${onTop ? 'z-index: 999;' : ''}`
    }
  },

  attached () {
    if (!Object.keys(this.data).includes('flySelector')) {
      console.error('缺少flySelector字段，请在data中指定主容器！')
    }
    const deviceInfo = getApp().deviceInfo
    this.setData({
      screenHeight: deviceInfo.screenHeight,
      screenWidth: deviceInfo.screenWidth
    })
  }
})