Page({
  data: {
    summaryChartArray: [],
    summaryChartNoData: false,
    summaryChartLoading: false,
    frequencyChartData: [],
    frequencyChartLoading: true,
    frequencyChartNoData: false,
    items: new Array(4).fill(0),
    cards: new Array(5).fill(0)
  },

  onLoad () {
    this.loadData()
  },

  onPullDownRefresh () {
    this.loadData()
  },

  loadData () {
    if (this.data.summaryChartLoading) return
    this.setData({
      summaryChartLoading: true,
      frequencyChartLoading: true
    })
    setTimeout(() => {
      this.setData({
        summaryChartNoData: Math.random() > 0.5,
        summaryChartLoading: false,
        frequencyChartNoData: Math.random() > 1,
        frequencyChartLoading: false
      })
      wx.stopPullDownRefresh()
    }, 1000)
  }
})