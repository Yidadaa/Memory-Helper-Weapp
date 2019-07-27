import { colors } from '../../utils/constant.js'
import api from '../../utils/api'

Page({
  data: {
    title: '',
    description: '',

    colors,
    selectedColorIndex: 0,
    criterionCount: 0,
    criterionExamples: ['忘记 / 掌握', '忘记 / 了解 / 掌握'],
    icon: 'default'
  },

  onColorSelected (e) {
    this.setData({
      selectedColorIndex: e.target.dataset.index
    })
  },

  onCriterionChange (e) {
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
  },

  onSaveBtn (e) {
    if (this.data.title.length === 0) {
      wx.showModal({
        title: '提示',
        content: '标题不能为空'
      })
    } else {
      api.createCardGroup({
        title: this.data.title,
        description: this.data.description,
        icon: this.data.icon,
        color: colors[this.data.selectedColorIndex]
      }).then(res => {
        console.log(res)
        wx.navigateBack()
      })
    }
  },

  onTitleChange (e) {
    this.setData({
      title: e.detail.value
    })
  },

  onDescriptionChange (e) {
    this.setData({
      description: e.detail.value
    })
  }
})