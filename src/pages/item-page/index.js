import GestureLogic from '../../behaviors/GestureLogic'
import api from '../../utils/api'
import format from '../../utils/format'

Component({
  behaviors: [GestureLogic({
    gestureID: 'Top',
    threshold: 200,
    endFuncName: 'refresh',
    direction: 'toBottom'
  })],

  data: {
    id: null,
    item: {},
    loading: false,
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
    onLoad (params) {
      const {id} = params
      console.log(params)
      this.loadData(id)
      this.setData({
        enableTopGesture: true,
        id
      })
    },
  
    onPageScroll (e) {
      // 限制下拉手势的触发条件，防止在滚动页面时触发刷新操作
      if (!this.data.enableTopGesture && e.detail.scrollTop < 100) {
        this.setData({
          enableTopGesture: true
        })
      } else if (this.data.enableTopGesture && e.detail.scrollTop > 50) {
        this.setData({
          enableTopGesture: false
        })
      }
      this.selectComponent('#fixed-bottom').onPageScroll(e)
    },
  
    onCardTap (e) {
      const index = e.currentTarget.dataset.index
      const isSameCard = index === this.data.displayCardIndex
      // 如果点击了同一张卡片，则需要收回该卡片
      this.setData({
        displayCardIndex: isSameCard ? -1: index,
        enableTopGesture: isSameCard
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
  
    loadData (id, cb) {
      this.setData({
        summaryChartLoading: true,
        frequencyChartLoading: true,
        loading: true
      })
      api.getCardGroup({id}).then(res => {
        this.setData({
          item: {
            ...res.data,
            start: format('YYYY / MM / DD', res.data.createdAt),
            end: format('YYYY / MM / DD', new Date())
          },
          frequencyChartNoData: Math.random() > 1,
          frequencyChartLoading: false,
          loading: false
        })
      })
    },

    showActionSheet () {
      wx.showActionSheet({
        itemList: ['分享', '编辑卡组', '删除卡组'],
        success: res => {
          [
            () => console.log('[触发卡组分享]'),
            () => wx.navigateTo({url: '/pages/new-item/index'}),
            () => wx.showModal({
              title: '确认移入回收站？',
              content: '您可以随时从回收站中恢复该卡组。',
              success: (res) => {
                if (res.confirm) {
                  this.deleteCardGroup()
                }
              }
            })
          ][res.tapIndex]()
        }
      })
    },

    deleteCardGroup () {
      api.deleteCardGroup({
        id: this.data.id
      }).then(console.log)
    }
  }
})