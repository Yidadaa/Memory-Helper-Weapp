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
    this.setData({
      items: new Array(5).fill(0).map((v, i) => {
        return {
          icon: 'fsf',
          title: 'LeetCode题目精选' + i.toString(),
          tags: ['编程', '自我提升']
        }
      })
    })
  },

  onPageScroll (e) {
    const curY = e.scrollTop
    const delta = curY - this.data.lastPageY
    this.setData({
      lastPageY: curY
    })
    if ((delta < 0) !== this.data.showBtn) {
      this.setData({
        showBtn: delta < 0
      })
    }
  }
})
