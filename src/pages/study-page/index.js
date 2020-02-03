import GestureLogic from '../../behaviors/GestureLogic'

Component({
  behaviors: [
    GestureLogic({
      gestureID: 'Study',
      threshold: 200,
      endFuncName: 'onGestureFinish',
      direction: 'toTop'
    })
  ],
  data: {
    total: 15,
    finished: 0,
    restudy: 0,
    remained: 15,

    cardTitle: '卡片标题',
    cardContent: new Array(10).fill('一些文字').join(''),

    flyStart: false,
    flyDone: false,
    flyStyle: '',

    show: false,
  },

  methods: {
    onLoad () {
      this.setData({
        enableStudyGesture: true
      })
      this.gestures = ['Study']
    },

    onShowBtn () {
      this.setData({
        show: true
      })
    },

    onCancelBtn () {
      wx.navigateBack()
    },

    onGestureFinish () {
      console.log('finish')
      this.setData({
        enableStudyGesture: false,
        show: false,
        finished: this.data.finished + !this.data.show - (this.data.remained == 0 && this.data.restudy == 0),
        restudy: this.data.restudy + this.data.show - (this.data.remained == 0 && this.data.restudy > 0),
        remained: this.data.remained - (this.data.remained > 0)
      })
    },

    onTouchStart (e) {
      this.gestures.forEach(v => this[`on${v}GestureStart`](e))
    },

    onTouchMove (e) {
      if (!this.data.enableStudyGesture) return
      if (!this.data.flyStart) {
        this.setData({
          flyStart: true
        })
      }
      this.gestures.forEach(v => this[`on${v}GestureMove`](e))
      this.updateStyle()
    },

    updateStyle () {
      let n = this.data.StudyNumber
      this.setData({
        flyStyle: [`width: ${ (1 - n * 0.5) * 100 }%`,
          `left: ${ n * 25 }vw`,
          `height: ${ (1 - n * 0.5) * 60 }vh`,
          `top: ${ 40 - n * 10}vh`,
          `transition: all ease .3s`
        ].join(';')
      })
    },

    onTouchEnd (e) {
      this.gestures.forEach(v => this[`on${v}GestureEnd`](e))
      if (!this.StudyMoved || !this.StudyTriggered) {
        this.resetStudyGesture()
        this.updateStyle()
        this.setData({
          flyStyle: 'border-bottom-left-radius: 0; border-bottom-right-radius: 0'
        })
        return
      }
      this.setData({
        flyStyle: `width: 100rpx;\
          left: 6vh;\
          height: 10vh;\
          width: 6vh;\
          top: 10vh;\
          border-radius: 20rpx;
          z-index: 99;
          padding: 0;\
          transition: all ease .3s;`,
        flyStart: false,
        flyDone: true
      })
      setTimeout(() => {
        this.setData({
          flyStyle: 'transition: none',
          enableStudyGesture: true,
          StudyNumber: 0,
          flyDone: false
        })
      }, 400)
    }
  }
})