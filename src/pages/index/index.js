//index.js
import { colors } from '../../utils/constant'
import api from '../../utils/api'

Page({
  data: {
    // 概览卡片的信息
    remained: 10,
    finished: 5,
    time: 10,

    // 项目信息
    items: [],
    loadingItems: true,
    noItemData: false,
  },

  onLoad () {
    const icons = ['finish-white', 'add-icon-white', 'folder-white', 'save-white']
  },

  onShow () {
    this.loadData(false)
  },

  onPullDownRefresh () {
    this.loadData()
  },

  loadData (withAnimation = true) {
    // 首次加载需要动画
    this.setData({
      loadingItems: withAnimation || !this.notFirst
    })
    this.notFirst = true
    // 非首次加载，除非是用户下拉刷新，否则没有大幅度动画
    api.getUserCardGroup().then(res => {
      this.setData({
        loadingItems: false,
        items: res.data.map(v => {
          return {
            ...v,
            progress: v.finish / v.total,
            shadowColor: v.color.replace(')', ', 0.2)').replace('rgb', 'rgba'),
            icon: `/imgs/${v.icon}.svg`,
            number: v.total
          }
        }),
        noItemData: res.data.length === 0
      })
      wx.stopPullDownRefresh()
    })
  },

  onShareAppMessage () {
    return {
      title: '憨批，来看👴的小程序',
      path: 'pages/index/index'
    }
  },

  onPageScroll (e) {
    this.selectComponent('#fixed-bottom').onPageScroll(e)
  }
})
