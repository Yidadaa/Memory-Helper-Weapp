Component({
  properties: {
    data: {
      type: Array,
      value: []
    },
    noData: {
      type: Boolean,
      value: false
    },
    loading: {
      type: Boolean,
      value: true
    },
    left: {
      type: Number,
      value: 0
    },
    color: {
      type: String,
      value: '#00C0FF'
    }
  },
  data: {
    renderData: new Array(7).fill(0).map(() => new Array(40).fill(0).map(v => Math.random())),
    firstRender: true,
    weekStrs: ['MON', 'TUE', 'WED', 'THU', 'FIR', 'SAT', 'SUN'],
    width: 40 * 35 + 5
  },
  methods: {
    onTap (e) {
      console.log('do something')
    },
    _getRandomData () {
      const today = new Date().getDay() - 1
      const fakeData = new Array(7).fill(0).map((v, i) => {
        return new Array(40 - (i > today)).fill(0).map(v => Math.random())
      })
      return fakeData
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
          renderData: data,
          width: data[0].length * 35 + 5
        })
      }
    }
  }
})