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
    renderData: new Array(40).fill(0).map(v => Math.random() * 100),
    firstRender: true
  },
  methods: {
    onTap (e) {
      console.log(e)
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
    }
  }
})