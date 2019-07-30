import api from '../../utils/api'

Page({
  data: {
    color: '#00C0FF',
    front: '',
    back: '',

    isSelecting: false,
    groups: [],
    selectedIndex: -1
  },
  
  onLoad (params) {
    const {groupID, color, cardID, edit} = params
    this.params = params
    this.setData({
      color: color || this.data.color
    })
    if (!edit) {
      // 传入groupID，表示新建卡片
      api.getUserCardGroup().then(res => {
        this.setData({
          groups: res.data,
          selectedIndex: res.data.findIndex(v => v._id === groupID)
        })
      })
    } else {
      // 传入cardID，表示编辑卡片
      Promise.all([api.getCard({id: cardID}), api.getUserCardGroup()]).then(res => {
        const [{card, group}, groups] = res
        this.setData({
          groups: groups.data,
          selectedIndex: groups.data.findIndex(v => v._id === group._id),
          front: card.front,
          back: card.back
        })
      })
    }
  },

  onTitleInput (e) {
    this.edited = true
    this.setData({
      front: e.detail.value
    })
  },

  onContentInput (e) {
    this.edited = true
    this.setData({
      back: e.detail.value
    })
  },

  onListTap (e) {
    if (this.data.disableSelector) return
    this.setData({
      isSelecting: true
    })
  },

  onListItemTap (e) {
    const index = e.currentTarget.dataset.index
    this.edited = index === this.data.selectedIndex
    this.setData({
      isSelecting: false,
      selectedIndex: index,
      color: this.data.groups[index].color
    })
  },

  onCancelBtn (e) {
    if (this.edited) {
      wx.showModal({
        title: '提示',
        content: '是否放弃编辑当前卡片？',
        success (res) {
          if (res.confirm) {
            wx.navigateBack()
          }
        }
      })
    } else {
      wx.navigateBack()
    }
  },

  onSaveBtn (e) {
    if (this.params.groupID) {
      api.createCard({
        front: this.data.front,
        back: this.data.back,
        groupID: this.params.fixGroup ?
          this.params.groupID :
          this.data.groups[this.data.selectedIndex]._id
      }).then(res => wx.navigateBack())
    } else if (this.params.cardID) {
      api.updateCard({
        id: this.params.cardID,
        data: {
          front: this.data.front,
          back: this.data.back,
          groupID: this.data.groups[this.data.selectedIndex]._id
        }
      }).then(res => wx.navigateBack())
    }
  }
})