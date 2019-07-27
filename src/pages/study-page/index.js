import GestureLogic from '../../behaviors/GestureLogic'

Component({
  behaviors: [GestureLogic({
    gestureID: 'Left',
    threshold: 120,
    endFuncName: 'finish',
    direction: 'toLeft'
  }), GestureLogic({
    gestureID: 'Right',
    threshold: 120,
    endFuncName: 'restudy',
    direction: 'toRight'
  }), GestureLogic({
    gestureID: 'Bottom',
    threshold: 120,
    endFuncName: 'see',
    direction: 'toBottom'
  })],

  data: {
    total: 15,
    finished: 2,
    restudy: 3,
    remained: 10,

    show: false,
  },

  methods: {
    onLoad () {
      this.setData({
        enableBottomGesture: true,
        enableLeftGesture: false,
        enableRightGesture: false
      })
      this.gestures = ['Bottom', 'Left', 'Right']
    },

    finish () {
      console.log('finish')
      this.resetBottomGesture()
      this.resetLeftGesture()
      if (this.data.remained > 0) {
        this.setData({
          finished: this.data.finished + 1,
          remained: this.data.remained - 1,
          enableBottomGesture: true,
          enableLeftGesture: false,
          enableRightGesture: false
        })
      } else if (this.data.restudy > 0) {
        this.setData({
          restudy: this.data.restudy - 1,
          finished: this.data.finished + 1,
          enableBottomGesture: true,
          enableLeftGesture: false,
          enableRightGesture: false
        })
      }
    },

    restudy () {
      console.log('restudy')
      this.resetBottomGesture()
      this.resetRightGesture()
      if (this.data.remained > 0) {
        this.setData({
          restudy: this.data.restudy + 1,
          remained: this.data.remained - 1,
          enableBottomGesture: true,
          enableLeftGesture: false,
          enableRightGesture: false
        })
      }
    },

    see () {
      this.setData({
        enableBottomGesture: true,
        enableLeftGesture: true,
        enableRightGesture: true
      })
    },

    onCardTap () {
      this.setData({
        show: !this.data.show
      })
    },

    onTouchStart (e) {
      this.gestures.forEach(v => this[`on${v}GestureStart`](e))
    },

    onTouchMove (e) {
      this.gestures.forEach(v => this[`on${v}GestureMove`](e))
    },

    onTouchEnd (e) {
      this.gestures.forEach(v => this[`on${v}GestureEnd`](e))
    }
  }
})