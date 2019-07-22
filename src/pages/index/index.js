//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // 概览卡片的信息
    remained: 10,
    finished: 5,
    time: 10,

    // 项目信息
    items: [],

    // 处理button动画
    lastPageY: 0,
    showBtn: true,
  },

  onLoad () {
    const icons = ['finish-white', 'add-icon-white', 'folder-white', 'save-white']
    const colors = ['rgb(0, 192, 255)', 'rgb(255, 62, 120)', 'rgb(149, 210, 186)', 'rgb(254, 217, 129)', 'rgb(255, 100, 76)']
    this.setData({
      items: new Array(5).fill(0).map((v, i) => {
        return {
          icon: 'fsf',
          title: 'LeetCode题目精选' + i.toString(),
          progress: Math.random() * 0.5 + 0.5,
          color: colors[i % colors.length],
          shadowColor: colors[i % colors.length].replace(')', ', 0.2)').replace('rgb', 'rgba'),
          icon: `/imgs/${icons[i % icons.length]}.svg`,
          number: parseInt(Math.random() * 200 + 1)
        }
      })
    })
  },

  onPageScroll (e) {
    this.selectComponent('#fixed-bottom').onPageScroll(e)
  }
})
