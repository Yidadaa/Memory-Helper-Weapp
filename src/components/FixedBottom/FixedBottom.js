Component({
  data: {
    lastPageY: 0,
    show: true
  },

  methods: {
    onPageScroll (e) {
      const curY = e.scrollTop
      const delta = curY - this.data.lastPageY
      this.setData({
        lastPageY: curY
      })
      if ((delta < 0) !== this.data.show) {
        this.setData({
          show: delta < 0
        })
      }
    }
  }
})