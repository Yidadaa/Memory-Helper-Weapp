import api from '../../utils/api'

Page({
  data: {
    front: '',
    back: '',

    isSelecting: false,
    groups: [],
    selectedIndex: 0
  },
  
  onLoad (params) {
    console.log(params)
    const {groupID, fixGroup} = params
    this.params = params
    api.getUserCardGroup().then(res => {
      this.setData({
        groups: res.data,
        selectedIndex: res.data.findIndex(v => v._id === groupID)
      })
    })
  },

  onTitleInput (e) {
    this.setData({
      front: e.detail.value
    })
  },

  onContentInput (e) {
    this.setData({
      back: e.detail.value
    })
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
  },

  onSaveBtn (e) {
    api.createCard({
      front: this.data.front,
      back: this.data.back,
      groupID: this.params.fixGroup ?
        this.params.groupID :
        this.data.groups[this.data.selectedIndex]._id
    }).then(console.log)
  }
})