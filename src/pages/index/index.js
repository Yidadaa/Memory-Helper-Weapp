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

    noItemData: false,
  },

  onLoad () {
    const icons = ['finish-white', 'add-icon-white', 'folder-white', 'save-white']
  },

  onShow () {
    api.getUserCardGroup().then(res => {
      this.setData({
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
