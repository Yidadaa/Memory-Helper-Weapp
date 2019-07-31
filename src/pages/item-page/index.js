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
    color: '#00C0FF',
    group: {},
    loading: false,
    frequencyChartData: [],
    frequencyChartLoading: true,
    frequencyChartNoData: false,

    // 卡片信息
    noCardData: false,
    cards: [],
    displayCardIndex: -1
  },

  methods: {
    onLoad (params) {
      const {id, color} = params
      this.loadData(id)
      this.setData({
        enableTopGesture: true,
        id, color
      })
    },

    onShow () {
      this.loadData(this.data.id)
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
      this.loadData(this.data.id, this.resetTopGesture.bind(this))
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
      Promise.all([api.getCardGroup({id}), api.getAllCardsOf({id})]).then(res => {
        const [cardGroup, cards] = res
        this.setData({
          group: {
            ...cardGroup.data,
            start: format('YYYY / MM / DD', cardGroup.data.createdAt),
            end: format('YYYY / MM / DD', new Date())
          },
          cards: cards.data.map(v => {
            return {
              ...v,
              createdAt: format('YYYY 年 MM 月 DD 日  hh:mm', v.createdAt),
              status: ['学习中', '已掌握'][v.status]
            }
          }),
          color: cardGroup.data.color,
          frequencyChartNoData: Math.random() > 1,
          frequencyChartLoading: false,
          loading: false,
          noCardData: cards.data.length === 0
        })
        cb && cb()
      })
    },

    showActionSheet () {
      wx.showActionSheet({
        itemList: ['分享', '编辑卡组', '删除卡组'],
        success: res => {
          [
            () => console.log('[触发卡组分享]'),
            () => wx.navigateTo({url: `/pages/new-item/index?groupID=${this.data.group._id}`}),
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
      }).then(res => {
        wx.navigateBack()
      })
    }
  }
})