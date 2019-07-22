Page({
  data: {
    isSelecting: false,
    subItems: new Array(5).fill(0).map((v, i) => 'LeetCode题目精选' + i),
    selectedIndex: 0
  },

  onListTap (e) {
    this.setData({
      isSelecting: true
    })
  },

  onListItemTap (e) {
    this.setData({
      isSelecting: false,
      selectedIndex: e.currentTarget.dataset.index
    })
  },

  onCancelBtn (e) {
    wx.showModal({
      title: '提示',
      content: '是否放弃编辑当前卡片？',
      success (res) {
        if (res.confirm) {
          wx.navigateBack()
        }
      }
    })
  }
})