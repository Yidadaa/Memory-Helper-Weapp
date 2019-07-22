Page({
  data: {
    itemTitle: 'LeetCode题目精选',
    summaryChartArray: [],
    summaryChartNoData: false,
    summaryChartLoading: false,
    frequencyChartData: [],
    frequencyChartLoading: true,
    frequencyChartNoData: false,

    // 卡片信息
    cards: new Array(5).fill(0),
    displayCardIndex: -1,
    shouldShowCard: false,
    shouldFlyCard: false,
    cardLeftOffset: 0,
    cardTopOffset: 0,
    cardHeight: 0
  },

  onLoad () {
    this.loadData()
  },

  onPullDownRefresh () {
    this.loadData()
  },

  onPageScroll (e) {
    this.selectComponent('#fixed-bottom').onPageScroll(e)
  },

  onCardTap (e) {
    const target = e.currentTarget
    wx.createSelectorQuery().select(`#${target.id}`).boundingClientRect().exec(res => {
      res = res[0]
      this.setData({
        displayCardIndex: target.dataset.index,
        shouldShowCard: true,
        shouldFlyCard: false,
        cardLeftOffset: res.left,
        cardTopOffset: res.top,
        cardHeight: res.height
      })
      this.thenFly()
    })
  },

  thenFly () {
    setTimeout(() => {
      this.setData({
        shouldShowCard: true,
        shouldFlyCard: true
      })
    }, 300);
  },

  onCardClose () {
    this.setData({
      shouldFlyCard: false
    })
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