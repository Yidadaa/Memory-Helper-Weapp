Component({
  properties: {
    show: {
      type: Boolean,
      value: true
    }
  },

  data: {
    lastPageY: 0,
    shouldShow: true
  },

  methods: {
    onPageScroll (e) {
      const curY = e.scrollTop || (e.detail && e.detail.scrollTop) || 0
      const delta = curY - this.data.lastPageY
      this.setData({
        lastPageY: curY
      })
      const newShouldShow = delta < 0
      if (newShouldShow !== this.data.shouldShow) {
        this.setData({
          shouldShow: newShouldShow
        })
      }
    }
  }
})