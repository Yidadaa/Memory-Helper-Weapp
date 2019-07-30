import api from '../../utils/api'

Page({
  data: {
    summaryChartArray: [],
    summaryChartNoData: false,
    summaryChartLoading: false,
    frequencyChartData: [],
    frequencyChartLoading: true,
    frequencyChartNoData: false,
    items: [],
    cards: [],
    noCardData: false,
    noProgressData: false
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
    this.loadProgress()
    setTimeout(() => {
      this.setData({
        summaryChartNoData: Math.random() > 0.5,
        summaryChartLoading: false,
        frequencyChartNoData: Math.random() > 1,
        frequencyChartLoading: false,
        noCardData: true
      })
      wx.stopPullDownRefresh()
    }, 1000)
  },

  loadProgress () {
    return new Promise((resolve) => {
      api.getUserCardGroup().then(res => {
        this.setData({
          items: res.data.map(v => {
            return {
              ...v,
              progress: v.total ? (v.finish / v.total * 100).toFixed(0) : 0,
              shadowColor: v.color.replace(')', ', 0.2)').replace('rgb', 'rgba'),
              icon: `/imgs/${v.icon}.svg`
            }
          }),
          noProgressData: res.data.length === 0
        })
      })
    })
  }
})