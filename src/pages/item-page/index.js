import GestureLogic from '../../behaviors/GestureLogic'

Component({
  behaviors: [GestureLogic({
    gestureID: 'Top',
    threshold: 200,
    endFuncName: 'refresh',
    direction: 'toBottom'
  })],

  data: {
    itemTitle: 'LeetCode题目精选',
    summaryChartArray: [],
    summaryChartNoData: false,
    summaryChartLoading: false,
    frequencyChartData: [],
    frequencyChartLoading: true,
    frequencyChartNoData: false,

    // 卡片信息
    cards: new Array(5).fill({
      date: '2018/07/19 23:00',
      title: '122 - 股票买入的最佳时机',
      content: '只需要选择基色的亮度和饱和度值与混合色进行混合而创建的效果，混合后的亮度及饱和度取决于基色，但色相取决于混合色',
      folder: 'LeetCode题目精选',
      status: '掌握',
      times: '10'
    }),
    displayCardIndex: -1
  },

  methods: {
    onLoad () {
      this.loadData()
      this.setData({
        enableTopGesture: true
      })
    },
  
    onPageScroll (e) {
      if (!this.data.enableTopGesture && e.scrollTop < 10) {
        this.setData({
          enableTopGesture: true
        })
      } else if (this.data.enableTopGesture && e.scrollTop > 10) {
        this.setData({
          enableTopGesture: false
        })
      }
      this.selectComponent('#fixed-bottom').onPageScroll(e)
    },
  
    onCardTap (e) {
      const index = e.currentTarget.dataset.index
      this.setData({
        displayCardIndex: index === this.data.displayCardIndex ? -1: index
      })
    },

    refresh () {
      this.loadData(this.resetTopGesture.bind(this))
    },

    hideFlyCard (e) {
      this.setData({
        displayCardIndex: -1
      })
    },
  
    loadData (cb) {
      if (this.data.summaryChartLoading) return
      this.setData({
        summaryChartLoading: true,
        frequencyChartLoading: true
      })
      setTimeout(() => {
        this.setData({
          summaryChartNoData: Math.random() > 0.5,
          summaryChartLoading: false,
          frequencyChartNoData: Math.random() > 1,
          frequencyChartLoading: false
        })
        cb && cb()
      }, 1000)
    }
  }
})