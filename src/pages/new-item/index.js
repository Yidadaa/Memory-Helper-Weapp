Page({
  data: {
    colors: ['rgba(0, 192, 255, 1)', 'rgba(255, 62, 120, 1)', 'rgba(149, 210, 186, 1)'],
    selectedColorIndex: 0,
    criterionCount: 0,
    criterionExamples: ['忘记 / 掌握', '忘记 / 了解 / 掌握']
  },

  onColorSelected (e) {
    this.setData({
      selectedColorIndex: e.target.dataset.index
    })
  },

  onCriterionChange (e) {
    console.log(e)
    this.setData({
      criterionCount: e.target.dataset.index
    })
  },

  onCancelBtn (e) {
    wx.showModal({
      title: '提示',
      content: '是否放弃编辑当前项目？',
      success (res) {
        if (res.confirm) {
          wx.navigateBack()
        }
      }
    })
  }
})