import api from '../../utils/api'
import promiseForEach from '../../utils/promiseForEach'

Page({
  data: {
    summaryChartArray: [],
    summaryChartNoData: false,
    summaryChartLoading: false,

    frequencyChartData: [],
    frequencyChartLoading: true,
    frequencyChartNoData: false,

    items: [],
    loadingProgress: true,
    noProgressData: false,

    cards: [],
    loadingCard: true,
    noCardData: false
  },

  onLoad () {
    this.loadData()
  },

  onPullDownRefresh () {
    this.loadData()
  },

  loadData () {
    this.setData({
      summaryChartLoading: true,
      frequencyChartLoading: true,
      loadingProgress: true,
      loadingCards: true
    })
    promiseForEach([
      this.loadSummary,
      this.loadFrequency,
      this.loadProgress,
      this.loadCards].map(func => func.bind(this))).then(res => console.log)
  },

  loadSummary () {
    return new Promise(resolve => {
      setTimeout(() => {
        this.setData({
          summaryChartNoData: false,
          summaryChartLoading: false,
        })
        resolve('summary')
      }, 1000)
    })
  },

  loadFrequency () {
    return new Promise(resolve => {
      setTimeout(() => {
        this.setData({
          frequencyChartNoData: false,
          frequencyChartLoading: false,
        })
        resolve('freq')
      }, 500)
    })
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
          noProgressData: res.data.length === 0,
          loadingProgress: false
        })
      })
      resolve('progress')
    })
  },

  loadCards () {
    return new Promise(resolve => {
      setTimeout(() => {
        this.setData({
          noCardData: true,
          loadingCards: false
        })
        resolve('cards')
      }, 500)
    })
  }
})