Component({
  properties: {
    data: {
      type: Array,
      value: []
    },
    noData: {
      type: Boolean,
      value: true
    },
    loading: {
      type: Boolean,
      value: false
    }
  },
  data: {
    renderData: new Array(40).fill(0),
    firstRender: true,
    shouldBlur: true
  },
  methods: {
    onTap (e) {
      console.log(e)
    },
    _getRandomData () {
      return new Array(40).fill(0).map(v => Math.random() * 100)
    }
  },
  observers: {
    'data': function(data) {
      // 这里使用observers是为了触发tansition动画
      if (this.data.firstRender) {
        this.setData({
          firstRender: false
        })
      } else {
        this.setData({
          renderData: data
        })
      }
    },
    'noData, loading': function(noData, loading) {
      /**
       * 组件有三种状态：
       *  1. 加载态[loading]
       *  2. 加载完毕有数据[!loading and !noData]
       *  3. 加载完毕无数据[!loading and noData]
       */
      if (this.loadingTimer) clearInterval(this.loadingTimer)
      if (loading) {
        // 进入加载状态，动画是随机生成的柱状图
        this.loadingTimer = setInterval(() => {
          this.setData({
            renderData: this._getRandomData(),
            shouldBlur: true
          })
        }, 1000)
      } else {
        this.setData({
          renderData: this._getRandomData(),
          shouldBlur: noData
        })
      }
    }
  }
})