Page({
  data: {
    summaryChartArray: [],
    summaryChartNoData: false,
    summaryChartLoading: false,
    frequencyChartData: []
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
      summaryChartLoading: true
    })
    setTimeout(() => {
      this.setData({
        summaryChartNoData: Math.random() > 0.5,
        summaryChartLoading: false
      })
      wx.stopPullDownRefresh()
    }, 5000)
  }
})